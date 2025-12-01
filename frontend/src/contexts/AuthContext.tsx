'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { usePlayerRegistration } from '@/hooks/useContract';

type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isRegistered, playerInfo } = usePlayerRegistration();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already connected
    const checkAuth = async () => {
      try {
        if (isConnected && address) {
          // Here you might want to fetch additional user data from your backend
          setUser({
            address,
            isRegistered,
            playerInfo,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [address, isConnected, isRegistered, playerInfo]);

  const signIn = async () => {
    // Wallet connection is handled by wagmi
    // Additional auth logic can be added here (e.g., JWT token generation)
    if (isConnected && address) {
      setUser({
        address,
        isRegistered,
        playerInfo,
      });
      return;
    }
    throw new Error('Failed to sign in');
  };

  const signOut = async () => {
    try {
      await disconnect();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
