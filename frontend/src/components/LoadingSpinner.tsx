'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  message?: string;
  progress?: number;
  className?: string;
  /** Whether to show the loading text for screen readers */
  showAriaLabel?: boolean;
  /** Custom aria label for better accessibility */
  ariaLabel?: string;
  /** Whether to show animation effects */
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'border-blue-600 border-t-transparent',
  secondary: 'border-green-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-600 border-t-transparent',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  message,
  progress,
  className = '',
  showAriaLabel = true,
  ariaLabel,
  animated = true,
}: LoadingSpinnerProps) {
  const displayLabel = ariaLabel || message || 'Loading';
  
  return (
    <div 
      className={`flex flex-col items-center justify-center gap-3 ${className}`} 
      role="status" 
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        className={`border-2 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        animate={animated ? { rotate: 360 } : {}}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        aria-hidden="true"
      />
      
      {progress !== undefined && (
        <div className="mt-1 w-40 bg-gray-200 rounded-full h-2.5 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Loading progress: ${progress}%`}>
          <motion.div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      )}
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-gray-700 text-center max-w-xs"
          aria-live="polite"
        >
          {message}
        </motion.p>
      )}
      
      {showAriaLabel && (
        <span className="sr-only">{displayLabel}</span>
      )}
    </div>
  );
}