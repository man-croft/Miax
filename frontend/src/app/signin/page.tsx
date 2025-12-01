'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getWalletError, 
  getWalletErrorMessage, 
  isUserRejectedError, 
  isRecoverableError,
  WalletErrorType
} from '@/utils/walletErrors';
import { trackWalletError } from '@/utils/errorTracking';
import { ErrorDisplay } from '@/components/ErrorDisplay';

// Maximum number of retry attempts for recoverable errors
const MAX_RETRY_ATTEMPTS = 3;

export default function SignInPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeConnector, setActiveConnector] = useState<string | null>(null);
  
  const { connect, connectors, error: wagmiError, reset: resetConnect } = useConnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const { signIn, isLoading, error: authError, clearError } = useAuth();
  const router = useRouter();
  
  // Track connection state changes
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  // Reset connection state when component mounts or address changes
  useEffect(() => {
    setConnectionState('idle');
    setConnectionError(null);
    setRetryCount(0);
    clearError();
  }, [address, clearError]);

  // Handle wagmi connection errors
  useEffect(() => {
    if (wagmiError) {
      const error = getWalletError(wagmiError);
      trackWalletError(wagmiError, { 
        context: 'wagmi_connect',
        errorType: error.type,
        retryCount,
        activeConnector
      });
      
      setConnectionError(error.message);
      setConnectionState('error');
      
      // Auto-retry for recoverable errors
      if (isRecoverableError(wagmiError) && retryCount < MAX_RETRY_ATTEMPTS) {
        const timer = setTimeout(() => {
          handleRetry();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [wagmiError, retryCount, activeConnector]);

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      const error = getWalletError(authError);
      setConnectionError(error.message);
      setConnectionState('error');
    }
  }, [authError]);

  // Handle successful connection and sign-in
  useEffect(() => {
    if (isConnected && connectionState !== 'connected') {
      const handleSignIn = async () => {
        try {
          setConnectionState('connecting');
          await signIn();
          setConnectionState('connected');
          router.push('/dashboard');
        } catch (error) {
          if (!isUserRejectedError(error)) {
            const walletError = getWalletError(error);
            console.error('Sign in error:', walletError);
            trackWalletError(error, { 
              context: 'sign_in',
              errorType: walletError.type,
              address
            });
            setConnectionError(walletError.message);
            setConnectionState('error');
          }
        }
      };
      
      handleSignIn();
    }
  }, [isConnected, signIn, router, connectionState, address]);
  
  // Handle retry logic for recoverable errors
  const handleRetry = useCallback(() => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      setConnectionError('Maximum retry attempts reached. Please try again later.');
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setConnectionError(null);
    resetConnect(); // Reset wagmi connection state
    
    // Reconnect with the same connector if available
    if (activeConnector) {
      const connector = connectors.find(c => c.name === activeConnector);
      if (connector) {
        connect({ connector });
      }
    }
  }, [retryCount, activeConnector, connectors, connect, resetConnect]);

  const handleConnect = async (connector: any) => {
    if (isConnecting || connectionState === 'connecting') return;
    
    try {
      setConnectionError(null);
      setIsConnecting(true);
      setConnectionState('connecting');
      setActiveConnector(connector.name);
      setRetryCount(0);
      
      // Reset any previous connection state
      resetConnect();
      
      await connect({ 
        connector,
        onError: (error) => {
          const walletError = getWalletError(error);
          
          if (!isUserRejectedError(error)) {
            console.error('Wallet connection error:', walletError);
            trackWalletError(error, { 
              context: 'wallet_connect',
              connector: connector.name,
              errorType: walletError.type,
              chainId: chain?.id,
              isConnected
            });
            
            setConnectionError(walletError.message);
            setConnectionState('error');
          }
        }
      });
    } catch (error) {
      const walletError = getWalletError(error);
      
      if (!isUserRejectedError(error)) {
        console.error('Unexpected connection error:', walletError);
        trackWalletError(error, { 
          context: 'wallet_connect_unexpected',
          connector: connector?.name || 'unknown',
          errorType: walletError.type
        });
        
        setConnectionError(walletError.message);
        setConnectionState('error');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const getConnectorButtonText = (connectorName: string) => {
    const buttonTexts: Record<string, { emoji: string; name: string }> = {
      'MetaMask': { emoji: '🦊', name: 'MetaMask' },
      'WalletConnect': { emoji: '🔗', name: 'WalletConnect' },
      'Coinbase Wallet': { emoji: '🪙', name: 'Coinbase Wallet' },
      'MiniPay': { emoji: '⚡', name: 'MiniPay' },
    };
    
    const buttonInfo = buttonTexts[connectorName] || { emoji: '🔌', name: connectorName };
    
    return (
      <span className="flex items-center justify-center gap-2">
        <span className="text-lg">{buttonInfo.emoji}</span>
        <span>{buttonInfo.name}</span>
        {connectionState === 'connecting' && activeConnector === connectorName && (
          <span className="ml-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
        )}
      </span>
    );
  };

  // Get the current connection status message
  const getStatusMessage = () => {
    if (connectionState === 'connecting') {
      return 'Connecting to your wallet...';
    }
    if (connectionState === 'connected') {
      return 'Success! Redirecting...';
    }
    if (retryCount > 0) {
      return `Attempting to reconnect (${retryCount}/${MAX_RETRY_ATTEMPTS})...`;
    }
    return 'Connect your wallet to continue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Zali
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {getStatusMessage()}
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6">
            <AnimatePresence>
              {connectionError && (
                <ErrorDisplay 
                  error={connectionError} 
                  onDismiss={() => setConnectionError(null)}
                />
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {connectors.map((connector) => {
                const isActive = activeConnector === connector.name && 
                               (connectionState === 'connecting' || connectionState === 'connected');
                
                return (
                  <motion.button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    disabled={isLoading || isConnecting || isActive}
                    className={`w-full flex items-center justify-center px-6 py-4 border-2 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-inner'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
                    }`}
                    whileHover={isActive ? {} : { scale: 1.02, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                    whileTap={isActive ? {} : { scale: 0.98 }}
                    aria-busy={isActive}
                  >
                    {getConnectorButtonText(connector.name)}
                  </motion.button>
                );
              })}
              
              {/* Help section */}
              <div className="pt-4 mt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-500">
                  Need help connecting?{' '}
                  <a 
                    href="#" 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Show help modal or expand help section
                      setConnectionError('For help, please ensure you have a Web3 wallet installed and try again.');
                    }}
                  >
                    Get help
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
