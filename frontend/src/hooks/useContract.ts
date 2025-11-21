import { useContractRead, useContractWrite, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { CONTRACTS, GAME_CONSTANTS } from '@/config/contracts';
import { parseEther, formatEther } from 'viem';
import { useState, useEffect } from 'react';

// ============ TRIVIA GAME V2 HOOKS ============

/**
 * Hook for player registration and username management
 */
export function usePlayerRegistration() {
  const { address } = useAccount();

  // Check if player is registered
  const { data: playerInfo, refetch: refetchPlayerInfo } = useContractRead({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPlayerInfo',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Check if username is available
  const checkUsernameAvailability = async (username: string) => {
    // This would need to be implemented as a contract read
    return true; // Placeholder
  };

  // Register username
  const {
    write: registerUsername,
    data: registerData,
    isLoading: registerIsLoading,
    isError: registerIsError,
    error: registerError,
  } = useContractWrite({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'registerUsername',
  });

  // Update username (costs 0.01 CELO)
  const {
    write: updateUsername,
    data: updateData,
    isLoading: updateIsLoading,
    isError: updateIsError,
  } = useContractWrite({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'updateUsername',
  });

  const { isSuccess: registerIsSuccess } = useWaitForTransactionReceipt({
    hash: registerData?.hash,
  });

  const { isSuccess: updateIsSuccess } = useWaitForTransactionReceipt({
    hash: updateData?.hash,
  });

  const isRegistered = playerInfo ? (playerInfo as any)[6] : false; // isRegistered field

  return {
    playerInfo,
    isRegistered,
    registerUsername,
    registerIsLoading,
    registerIsSuccess,
    registerIsError,
    registerError,
    updateUsername,
    updateIsLoading,
    updateIsSuccess,
    updateIsError,
    checkUsernameAvailability,
    refetchPlayerInfo,
  };
}

/**
 * Hook for starting and playing games
 */
export function useGameSession() {
  const { address } = useAccount();

  // Get player's session count
  const { data: sessionCount } = useContractRead({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPlayerSessionCount',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Start a new game
  const {
    write: startGame,
    data: startGameData,
    isLoading: startGameIsLoading,
    isError: startGameIsError,
    error: startGameError,
  } = useContractWrite({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'startGame',
  });

  const { isSuccess: startGameIsSuccess } = useWaitForTransactionReceipt({
    hash: startGameData?.hash,
  });

  // Submit answers
  const {
    write: submitAnswers,
    data: submitData,
    isLoading: submitIsLoading,
    isError: submitIsError,
    error: submitError,
  } = useContractWrite({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'submitAnswers',
  });

  const { isSuccess: submitIsSuccess } = useWaitForTransactionReceipt({
    hash: submitData?.hash,
  });

  return {
    sessionCount: sessionCount ? Number(sessionCount) : 0,
    startGame,
    startGameIsLoading,
    startGameIsSuccess,
    startGameIsError,
    startGameError,
    submitAnswers,
    submitIsLoading,
    submitIsSuccess,
    submitIsError,
    submitError,
  };
}

/**
 * Hook for getting session details
 */
export function useSession(sessionId?: number) {
  const { address } = useAccount();

  const { data: sessionData, refetch: refetchSession } = useContractRead({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getSession',
    args: address && sessionId !== undefined ? [address, BigInt(sessionId)] : undefined,
    enabled: !!address && sessionId !== undefined,
    watch: true,
  });

  return {
    sessionData,
    refetchSession,
  };
}

/**
 * Hook for getting questions
 */
export function useQuestions(questionIds?: bigint[]) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!questionIds || questionIds.length === 0) return;

    const fetchQuestions = async () => {
      setLoading(true);
      // Fetch each question individually
      // This would need to be implemented with multiple contract reads
      setLoading(false);
    };

    fetchQuestions();
  }, [questionIds]);

  return {
    questions,
    loading,
  };
}

/**
 * Hook for rewards management
 */
export function useRewards() {
  const { address } = useAccount();

  // Get pending rewards
  const { data: pendingRewards, refetch: refetchPendingRewards } = useContractRead({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Get unclaimed sessions
  const { data: unclaimedSessions } = useContractRead({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getUnclaimedSessions',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Claim all rewards
  const {
    write: claimRewards,
    data: claimData,
    isLoading: claimIsLoading,
    isError: claimIsError,
    error: claimError,
  } = useContractWrite({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'claimRewards',
  });

  // Claim specific session rewards
  const {
    write: claimSessionRewards,
    data: claimSessionData,
    isLoading: claimSessionIsLoading,
  } = useContractWrite({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'claimSessionRewards',
  });

  const { isSuccess: claimIsSuccess } = useWaitForTransactionReceipt({
    hash: claimData?.hash,
  });

  const { isSuccess: claimSessionIsSuccess } = useWaitForTransactionReceipt({
    hash: claimSessionData?.hash,
  });

  return {
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : '0',
    unclaimedSessions: unclaimedSessions as bigint[] || [],
    claimRewards,
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    claimError,
    claimSessionRewards,
    claimSessionIsLoading,
    claimSessionIsSuccess,
    refetchPendingRewards,
  };
}

/**
 * Hook for leaderboard
 */
export function useLeaderboard(count: number = 10) {
  const { data: leaderboardData, refetch: refetchLeaderboard } = useContractRead({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getLeaderboard',
    args: [BigInt(count)],
    watch: true,
  });

  return {
    leaderboardData,
    refetchLeaderboard,
  };
}

/**
 * Hook for contract info
 */
export function useContractInfo() {
  // Get total questions
  const { data: questionCount } = useContractRead({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getQuestionCount',
    watch: true,
  });

  // Get contract balance
  const { data: contractBalance } = useContractRead({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getContractBalance',
    watch: true,
  });

  return {
    questionCount: questionCount ? Number(questionCount) : 0,
    contractBalance: contractBalance ? formatEther(contractBalance as bigint) : '0',
  };
}

/**
 * Hook for CELO balance
 */
export function useCeloBalance() {
  const { address } = useAccount();

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
    watch: true,
  });

  return {
    balance: balance?.value ? formatEther(balance.value) : '0',
    formatted: balance?.formatted || '0',
    symbol: balance?.symbol || 'CELO',
    refetchBalance,
  };
}

// ============ LEGACY FAUCET HOOK (Keep for backward compatibility) ============

export function useFaucet() {
  const { address } = useAccount();
  
  const { data: hasClaimed } = useContractRead({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'hasClaimed',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { data: contractBalance } = useContractRead({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'getContractBalance',
  });

  const { 
    write: claim, 
    data: claimData, 
    isLoading: claimIsLoading,
    isError: claimIsError,
  } = useContractWrite({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'claim',
  });

  const { isSuccess: claimIsSuccess } = useWaitForTransactionReceipt({
    hash: claimData?.hash,
  });

  return {
    claim,
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    hasClaimed: hasClaimed as boolean,
    contractBalance,
    claimAmount: parseEther('10'),
  };
}
