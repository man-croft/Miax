'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connect, connectors, error } = useConnect();
  const { isConnected } = useAccount();
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      signIn().then(() => {
        router.push('/dashboard');
      });
    }
  }, [isConnected, signIn, router]);

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(true);
      await connect({ connector });
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect your wallet to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error.message || 'Failed to connect wallet'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {connectors.map((connector) => (
                <motion.button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  disabled={isLoading || isConnecting}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isConnecting ? (
                    'Connecting...'
                  ) : (
                    <>
                      <span className="mr-2">
                        {connector.name === 'MetaMask' && '🦊'}
                        {connector.name === 'WalletConnect' && '🔗'}
                        {connector.name === 'Coinbase Wallet' && '🪙'}
                      </span>
                      Connect with {connector.name}
                    </>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
