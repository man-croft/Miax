/**
 * Custom error types for contract interactions
 */

export enum ContractErrorType {
  // Connection errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  CHAIN_NOT_SUPPORTED = 'CHAIN_NOT_SUPPORTED',
  CONTRACT_NOT_DEPLOYED = 'CONTRACT_NOT_DEPLOYED',
  
  // Transaction errors
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  
  // Contract-specific errors
  NOT_REGISTERED = 'NOT_REGISTERED',
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  INVALID_SESSION = 'INVALID_SESSION',
  SESSION_COMPLETED = 'SESSION_COMPLETED',
  INVALID_ANSWER = 'INVALID_ANSWER',
  
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface ContractError extends Error {
  code: ContractErrorType;
  details?: Record<string, any>;
  originalError?: any;
}

/**
 * Creates a standardized contract error object
 */
export function createContractError(
  type: ContractErrorType,
  message: string,
  details?: Record<string, any>,
  originalError?: any
): ContractError {
  const error = new Error(message) as ContractError;
  error.code = type;
  error.details = details;
  error.originalError = originalError;
  return error;
}

/**
 * Checks if an error is a user rejection error
 */
export function isUserRejectedError(error: any): boolean {
  return (
    error?.code === 4001 || // EIP-1193 user rejected request
    error?.code === 'ACTION_REJECTED' || // MetaMask
    error?.message?.includes('User rejected') || // Common pattern
    error?.message?.includes('user rejected') || // Common pattern
    error?.message?.includes('denied') // Some wallets use this
  );
}

/**
 * Checks if an error is due to insufficient funds
 */
export function isInsufficientFundsError(error: any): boolean {
  return (
    error?.code === 'INSUFFICIENT_FUNDS' ||
    error?.message?.includes('insufficient funds') ||
    error?.message?.includes('not enough funds') ||
    error?.details?.includes('insufficient funds')
  );
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('network') ||
    error?.message?.includes('Network') ||
    error?.name === 'NetworkError' ||
    !navigator.onLine
  );
}

/**
 * Parses a contract error and returns a user-friendly message
 */
export function parseContractError(error: any): { message: string; code: ContractErrorType } {
  console.error('Contract error:', error);

  // Handle user rejection
  if (isUserRejectedError(error)) {
    return {
      message: 'Transaction was rejected',
      code: ContractErrorType.TRANSACTION_REJECTED,
    };
  }

  // Handle insufficient funds
  if (isInsufficientFundsError(error)) {
    return {
      message: 'Insufficient funds for transaction',
      code: ContractErrorType.INSUFFICIENT_FUNDS,
    };
  }

  // Handle network errors
  if (isNetworkError(error)) {
    return {
      message: 'Network error. Please check your connection',
      code: ContractErrorType.NETWORK_ERROR,
    };
  }

  // Handle contract-specific errors
  if (typeof error?.message === 'string') {
    // Handle common contract revert reasons
    const message = error.message.toLowerCase();
    
    if (message.includes('not registered')) {
      return {
        message: 'Please register before performing this action',
        code: ContractErrorType.NOT_REGISTERED,
      };
    }
    
    if (message.includes('already registered')) {
      return {
        message: 'This address is already registered',
        code: ContractErrorType.ALREADY_REGISTERED,
      };
    }
    
    if (message.includes('invalid session') || message.includes('session does not exist')) {
      return {
        message: 'Invalid game session',
        code: ContractErrorType.INVALID_SESSION,
      };
    }
    
    if (message.includes('session already completed')) {
      return {
        message: 'This game session is already completed',
        code: ContractErrorType.SESSION_COMPLETED,
      };
    }
  }

  // Default error
  return {
    message: error?.message || 'An unknown error occurred',
    code: ContractErrorType.UNKNOWN_ERROR,
  };
}

/**
 * Wraps a contract call with error handling
 */
export async function withContractErrorHandling<T>(
  fn: () => Promise<T>,
  context: string = 'contract interaction'
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const { message, code } = parseContractError(error);
    const contractError = createContractError(
      code,
      `${context} failed: ${message}`,
      { context },
      error
    );
    
    // Log the full error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Contract Error] ${context}:`, {
        error,
        parsed: { message, code },
        contractError,
      });
    }
    
    throw contractError;
  }
}
