import { motion } from 'framer-motion';
import { XCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { WalletErrorType } from '@/utils/walletErrors';

type ErrorDisplayProps = {
  error: string | null;
  onDismiss?: () => void;
  className?: string;
};

export function ErrorDisplay({ error, onDismiss, className = '' }: ErrorDisplayProps) {
  if (!error) return null;

  // Determine the error type and style
  const isWarning = error.includes('try again') || error.includes('check your');
  const isInfo = error.includes('rejected') || error.includes('cancelled');
  
  const bgColor = isWarning 
    ? 'bg-yellow-50 border-yellow-400' 
    : isInfo 
      ? 'bg-blue-50 border-blue-400' 
      : 'bg-red-50 border-red-400';
      
  const textColor = isWarning 
    ? 'text-yellow-700' 
    : isInfo 
      ? 'text-blue-700' 
      : 'text-red-700';
      
  const icon = isWarning ? (
    <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
  ) : isInfo ? (
    <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
  ) : (
    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`rounded-md ${bgColor} border-l-4 p-4 mb-4 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>
            {error}
          </p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md ${bgColor} p-1.5 ${textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600`}
              >
                <span className="sr-only">Dismiss</span>
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
