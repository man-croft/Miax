'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingButton } from './LoadingButton';

/**
 * RetryableOperation Props
 */
export interface RetryableOperationProps<T> {
  operation: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  maxRetries?: number;
  retryDelay?: number;
  children: (state: RetryState<T>) => ReactNode;
  autoRetry?: boolean;
  /** Use exponential backoff for retry delays */
  useExponentialBackoff?: boolean;
  /** Maximum delay between retries in ms (for exponential backoff) */
  maxRetryDelay?: number;
}

/**
 * Retry state
 */
export interface RetryState<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  retryCount: number;
  retry: () => Promise<void>;
  reset: () => void;
  /** Calculated delay until next retry (for exponential backoff) */
  nextRetryDelay?: number;
}

/**
 * RetryableOperation component for operations with retry capability
 */
export function RetryableOperation<T>({
  operation,
  onSuccess,
  onError,
  maxRetries = 3,
  retryDelay = 1000,
  children,
  autoRetry = false,
  useExponentialBackoff = false,
  maxRetryDelay = 30000,
}: RetryableOperationProps<T>) {
  const [state, setState] = useState<Omit<RetryState<T>, 'retry' | 'reset'>>({
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    retryCount: 0,
    nextRetryDelay: retryDelay,
  });

  /**
   * Calculate delay with exponential backoff
   */
  const calculateDelay = (attempt: number): number => {
    if (!useExponentialBackoff) {
      return retryDelay;
    }
    // Exponential backoff: base * 2^attempt, capped at maxRetryDelay
    const exponentialDelay = retryDelay * Math.pow(2, attempt);
    return Math.min(exponentialDelay, maxRetryDelay);
  };

  const executeOperation = async (isRetry = false) => {
    const newRetryCount = isRetry ? state.retryCount + 1 : 0;
    const nextDelay = calculateDelay(newRetryCount);
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
      retryCount: newRetryCount,
      nextRetryDelay: nextDelay,
    }));

    try {
      const data = await operation();

      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      }));

      onSuccess?.(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Operation failed');

      // Auto retry if enabled and within limit
      if (autoRetry && newRetryCount < maxRetries) {
        const currentDelay = calculateDelay(newRetryCount);
        setTimeout(() => executeOperation(true), currentDelay);
        return;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err,
      }));

      onError?.(err);
    }
  };

  const retry = async () => {
    if (state.retryCount >= maxRetries) {
      return;
    }
    await executeOperation(true);
  };

  const reset = () => {
    setState({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      retryCount: 0,
      nextRetryDelay: retryDelay,
    });
  };

  return <>{children({ ...state, retry, reset })}</>;
}

/**
 * Default retry UI component
 */
export function RetryUI({
  error,
  onRetry,
  retryCount,
  maxRetries,
  isLoading,
  nextRetryDelay,
}: {
  error: Error | null;
  onRetry: () => void;
  retryCount: number;
  maxRetries: number;
  isLoading: boolean;
  nextRetryDelay?: number;
}) {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-red-600 font-semibold mb-2">Operation Failed</div>
      <div className="text-gray-600 text-sm mb-4">{error.message}</div>

      {retryCount < maxRetries && (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">
            Retry attempt {retryCount} of {maxRetries}
            {nextRetryDelay && ` • Next retry in ${Math.ceil(nextRetryDelay / 1000)}s`}
          </div>
          <LoadingButton
            onClick={onRetry}
            isLoading={isLoading}
            variant="primary"
            size="md"
            aria-label="Retry failed operation"
          >
            Retry Operation
          </LoadingButton>
        </div>
      )}

      {retryCount >= maxRetries && (
        <div className="text-sm text-red-600 font-medium">
          Maximum retry attempts reached. Please try again later.
        </div>
      )}
    </motion.div>
  );
}
