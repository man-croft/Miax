export enum WalletErrorType {
  // Connection errors
  NO_ETHEREUM_PROVIDER = 'NO_ETHEREUM_PROVIDER',
  USER_REJECTED = 'USER_REJECTED',
  ALREADY_PROCESSING = 'ALREADY_PROCESSING',
  UNSUPPORTED_CHAIN = 'UNSUPPORTED_CHAIN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Account errors
  ACCOUNT_ACCESS_DENIED = 'ACCOUNT_ACCESS_DENIED',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  
  // Transaction errors
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

interface WalletError {
  type: WalletErrorType;
  message: string;
  originalError?: unknown;
  context?: Record<string, unknown>;
}

const ERROR_MESSAGES: Record<WalletErrorType, string> = {
  [WalletErrorType.NO_ETHEREUM_PROVIDER]: 
    'No Ethereum wallet detected. Please install MetaMask or another web3 wallet.',
  [WalletErrorType.USER_REJECTED]: 
    'Connection was rejected. Please try again and approve the connection in your wallet.',
  [WalletErrorType.ALREADY_PROCESSING]: 
    'A request is already in progress. Please check your wallet and try again.',
  [WalletErrorType.UNSUPPORTED_CHAIN]: 
    'Unsupported network. Please switch to a supported network in your wallet.',
  [WalletErrorType.NETWORK_ERROR]: 
    'Network error. Please check your internet connection and try again.',
  [WalletErrorType.TIMEOUT]: 
    'Connection timed out. Please try again.',
  [WalletErrorType.ACCOUNT_ACCESS_DENIED]: 
    'Account access was denied. Please grant the required permissions.',
  [WalletErrorType.ACCOUNT_NOT_FOUND]: 
    'No accounts found. Please unlock your wallet and try again.',
  [WalletErrorType.TRANSACTION_REJECTED]: 
    'Transaction was rejected. Please try again.',
  [WalletErrorType.TRANSACTION_FAILED]: 
    'Transaction failed. Please check your wallet and try again.',
  [WalletErrorType.INSUFFICIENT_FUNDS]: 
    'Insufficient funds for transaction. Please add funds to your wallet.',
  [WalletErrorType.GAS_ESTIMATION_FAILED]: 
    'Failed to estimate gas. Please try again or adjust your transaction.',
  [WalletErrorType.RATE_LIMIT_EXCEEDED]: 
    'Too many requests. Please wait a moment and try again.',
  [WalletErrorType.PROVIDER_ERROR]: 
    'Wallet provider error. Please try again or contact support if the issue persists.',
  [WalletErrorType.UNKNOWN_ERROR]: 
    'An unexpected error occurred. Please try again or contact support if the issue persists.',
};

export function createWalletError(
  type: WalletErrorType, 
  originalError?: unknown,
  context?: Record<string, unknown>
): WalletError {
  return {
    type,
    message: ERROR_MESSAGES[type] || ERROR_MESSAGES[WalletErrorType.UNKNOWN_ERROR],
    originalError,
    context,
  };
}

export function getWalletError(error: unknown): WalletError {
  if (isWalletError(error)) {
    return error;
  }

  const errorObj = error as { code?: number | string; message?: string; cause?: unknown };
  
  // Handle common error patterns
  if (errorObj.code === 4001 || errorObj.code === 'ACTION_REJECTED') {
    return createWalletError(WalletErrorType.USER_REJECTED, error);
  }
  
  if (errorObj.message?.includes('already processing')) {
    return createWalletError(WalletErrorType.ALREADY_PROCESSING, error);
  }
  
  if (errorObj.message?.includes('No Ethereum provider') || 
      errorObj.message?.includes('No web3 provider available')) {
    return createWalletError(WalletErrorType.NO_ETHEREUM_PROVIDER, error);
  }
  
  if (errorObj.message?.includes('Unsupported chain') || 
      errorObj.message?.includes('Unrecognized chain ID')) {
    return createWalletError(WalletErrorType.UNSUPPORTED_CHAIN, error);
  }
  
  if (errorObj.message?.includes('network changed') || 
      errorObj.message?.includes('network changed')) {
    return createWalletError(WalletErrorType.NETWORK_ERROR, error);
  }
  
  if (errorObj.message?.includes('timeout') || 
      errorObj.message?.includes('timed out')) {
    return createWalletError(WalletErrorType.TIMEOUT, error);
  }
  
  if (errorObj.message?.includes('insufficient funds')) {
    return createWalletError(WalletErrorType.INSUFFICIENT_FUNDS, error);
  }
  
  if (errorObj.message?.includes('rate limit') || 
      errorObj.message?.includes('too many requests')) {
    return createWalletError(WalletErrorType.RATE_LIMIT_EXCEEDED, error);
  }
  
  // Check for provider-specific errors
  const providerError = errorObj.cause || error;
  if (providerError && typeof providerError === 'object' && 'code' in providerError) {
    return createWalletError(
      WalletErrorType.PROVIDER_ERROR, 
      error,
      { providerCode: (providerError as any).code }
    );
  }
  
  return createWalletError(WalletErrorType.UNKNOWN_ERROR, error);
}

export function getWalletErrorMessage(error: unknown): string {
  return getWalletError(error).message;
}

export function isUserRejectedError(error: unknown): boolean {
  if (!error) return false;
  const walletError = getWalletError(error);
  return [
    WalletErrorType.USER_REJECTED,
    WalletErrorType.ACCOUNT_ACCESS_DENIED,
  ].includes(walletError.type);
}

export function isWalletError(error: unknown): error is WalletError {
  return (
    typeof error === 'object' && 
    error !== null && 
    'type' in error && 
    'message' in error &&
    Object.values(WalletErrorType).includes((error as WalletError).type as WalletErrorType)
  );
}

export function isRecoverableError(error: unknown): boolean {
  if (!error) return false;
  const walletError = getWalletError(error);
  
  // List of error types that are considered recoverable
  const recoverableErrors = [
    WalletErrorType.ALREADY_PROCESSING,
    WalletErrorType.NETWORK_ERROR,
    WalletErrorType.TIMEOUT,
    WalletErrorType.RATE_LIMIT_EXCEEDED,
  ];
  
  return recoverableErrors.includes(walletError.type);
}
