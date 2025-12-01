import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useFaucet } from './useContract';

const MIN_BALANCE = 0.1; // Minimum balance in cUSD before showing faucet prompt
const AUTO_CLAIM_DELAY = 5000; // 5 seconds delay before auto-claiming

export function useAutoFaucet() {
  const { address } = useAccount();
  const { claim, claimIsLoading, claimIsSuccess } = useFaucet();
  const [showFaucetPrompt, setShowFaucetPrompt] = useState(false);
  const [isAutoClaiming, setIsAutoClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  // Check if user has sufficient balance
  const checkBalance = (balance: number | undefined) => {
    if (balance === undefined) return false;
    return balance >= MIN_BALANCE;
  };

  // Auto-claim function with delay
  const triggerAutoClaim = () => {
    if (isAutoClaiming || !address) return;
    
    setShowFaucetPrompt(true);
    setIsAutoClaiming(true);
    
    // Show prompt for a moment before auto-claiming
    const timer = setTimeout(async () => {
      try {
        await claim?.();
        setHasClaimed(true);
        // Hide the prompt after successful claim
        setTimeout(() => setShowFaucetPrompt(false), 3000);
      } catch (error) {
        console.error('Auto-claim failed:', error);
      } finally {
        setIsAutoClaiming(false);
      }
    }, AUTO_CLAIM_DELAY);

    return () => clearTimeout(timer);
  };

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!address) {
      setShowFaucetPrompt(false);
      setIsAutoClaiming(false);
      setHasClaimed(false);
    }
  }, [address]);

  // Handle claim success
  useEffect(() => {
    if (claimIsSuccess) {
      setHasClaimed(true);
      const timer = setTimeout(() => {
        setShowFaucetPrompt(false);
        setHasClaimed(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [claimIsSuccess]);

  return {
    showFaucetPrompt,
    isAutoClaiming,
    hasClaimed,
    checkBalance,
    triggerAutoClaim,
    cancelAutoClaim: () => {
      setShowFaucetPrompt(false);
      setIsAutoClaiming(false);
    }
  };
}
