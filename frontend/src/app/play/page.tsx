'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTriviaGame, useAutoFaucet } from '@/hooks/useContract';
import { formatEther, parseEther } from 'viem';
import { GameState, CONTRACTS } from '@/config/contracts';
import { useContractWrite, useWaitForTransactionReceipt } from 'wagmi';

export default function PlayPage() {
  const { address } = useAccount();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  
  // Use game ID 1 for the featured game
  const GAME_ID = 1;
  const { 
    gameInfo, 
    gameState, 
    prizePool, 
    players, 
    hasJoined,
    joinGame,
    joinIsLoading,
    joinIsSuccess,
    joinIsError,
    joinError,
  } = useTriviaGame(GAME_ID);
  
  const { 
    needsClaim, 
    hasClaimed, 
    balance, 
    autoClaimIfNeeded, 
    claimIsLoading 
  } = useAutoFaucet();
  
  // cUSD Approval
  const { 
    write: approveCUSD, 
    data: approvalData,
    isLoading: approvalIsLoading,
  } = useContractWrite({
    address: CONTRACTS.cUSD.address,
    abi: [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ],
    functionName: 'approve',
  });
  
  const { isSuccess: approvalIsSuccess } = useWaitForTransactionReceipt({
    hash: approvalData?.hash,
  });
  
  // Handle join success
  useEffect(() => {
    if (joinIsSuccess && isJoining) {
      toast.dismiss(); // Dismiss loading toast
      toast.success('Successfully joined the game!');
      setIsJoining(false);
      router.push(`/play/game?gameId=${GAME_ID}`);
    }
  }, [joinIsSuccess, router, isJoining, GAME_ID]);

  // Handle join error
  useEffect(() => {
    if (joinIsError && isJoining) {
      toast.dismiss();
      const errorMessage = joinError?.message || 'Failed to join game';
      toast.error(errorMessage.includes('User rejected') ? 'Transaction cancelled' : 'Failed to join game. Please try again.');
      setIsJoining(false);
    }
  }, [joinIsError, joinError, isJoining]);

  const handleStartPlaying = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Check if already joined
    if (hasJoined) {
      toast.success('You\'ve already joined! Starting game...');
      router.push(`/play/game?gameId=${GAME_ID}`);
      return;
    }

    setIsJoining(true);

    try {
      // Auto-claim from faucet if needed
      if (needsClaim && !hasClaimed) {
        const loadingToast = toast.loading('Getting you some cUSD from faucet...');
        try {
          const claimed = await autoClaimIfNeeded();
          toast.dismiss(loadingToast);
          if (claimed) {
            toast.success('Received 10 cUSD! Now joining game...');
            // Wait a bit for balance to update
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error('Failed to claim from faucet. Please try again.');
          setIsJoining(false);
          return;
        }
      }

      // Check game state
      console.log('Game state:', gameState);
      console.log('GameState.Open:', GameState.Open);
      console.log('Game info:', gameInfo);
      
      if (gameState !== undefined && gameState !== GameState.Open) {
        toast.error(`Game is not open for joining (current state: ${gameState})`);
        setIsJoining(false);
        return;
      }
      
      if (!gameInfo || gameInfo[0] === 0n) {
        toast.error('Game #1 has not been created yet. Please create the game first.');
        console.error('Game needs to be created. Call createGame("Celo Basics Quiz", 10) on the contract.');
        setIsJoining(false);
        return;
      }
      
      const entryFee = gameInfo[2]; // Entry fee from game info
      console.log('Entry fee:', formatEther(entryFee), 'cUSD');
      
      // Approve cUSD spending if needed
      if (approveCUSD && entryFee > 0n) {
        toast.loading('Approving cUSD spending...');
        try {
          approveCUSD({
            args: [CONTRACTS.triviaGame.address, entryFee],
          });
          
          // Wait for approval
          console.log('Waiting for approval...');
          // Note: We'll continue after approval in a separate useEffect
          return; // Exit here, will continue after approval
        } catch (err) {
          console.error('Approval error:', err);
          toast.dismiss();
          toast.error('Failed to approve cUSD spending');
          setIsJoining(false);
          return;
        }
      }

      // Join the game
      if (!joinGame) {
        toast.error('Unable to join game. Please try again.');
        setIsJoining(false);
        return;
      }

      toast.loading('Joining game... Please confirm the transaction in your wallet', {
        duration: 60000, // 60 second timeout
      });
      
      try {
        console.log('Calling joinGame with gameId:', GAME_ID);
        console.log('Contract address:', '0x90c9ba691da6a027bf8cc173ea5171c29b3f3673');
        console.log('User address:', address);
        
        joinGame({
          args: [BigInt(GAME_ID)],
        });
        
        console.log('joinGame called successfully, waiting for user confirmation...');
        // Note: setIsJoining(false) will be called in useEffect when joinIsSuccess or joinIsError is true
      } catch (err: any) {
        console.error('Error calling joinGame:', err);
        toast.dismiss();
        toast.error('Failed to initiate transaction');
        setIsJoining(false);
      }
    } catch (error: any) {
      console.error('Error joining game:', error);
      toast.dismiss();
      toast.error(error?.message || 'Failed to join game');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Play Trivia</h1>
          <p className="text-gray-600">Test your Celo knowledge and earn cUSD rewards!</p>
        </div>
        
        {/* Featured Game Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-2 border-green-200"
        >
          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 Featured Game
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎓 Celo Basics Quiz
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Test your knowledge about Celo blockchain and earn cUSD rewards!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">💰 Prize Pool</p>
                <p className="text-2xl font-bold text-green-600">
                  {prizePool ? formatEther(prizePool) : '0'} cUSD
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">🎫 Entry Fee</p>
                <p className="text-2xl font-bold text-blue-600">
                  {gameInfo ? formatEther(gameInfo[2]) : '0.1'} cUSD
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">👥 Players</p>
                <p className="text-2xl font-bold text-purple-600">
                  {players?.length || 0}/{gameInfo ? Number(gameInfo[4]) : '10'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">⏱️ Time</p>
                <p className="text-2xl font-bold text-orange-600">2.5 min</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartPlaying}
                disabled={!address || joinIsLoading || claimIsLoading || isJoining}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed min-w-[250px]"
              >
                {!address 
                  ? '🔌 Connect Wallet First'
                  : joinIsLoading || claimIsLoading || isJoining
                    ? '⏳ Processing...'
                    : hasJoined
                      ? '🎮 Continue Playing'
                      : '🎮 Start Playing Now'
                }
              </button>
              
              {!address && (
                <p className="text-sm text-gray-500">
                  Connect your wallet to start playing
                </p>
              )}
              
              {address && needsClaim && !hasClaimed && (
                <p className="text-sm text-blue-600 font-medium">
                  🎉 You'll receive 10 free cUSD to start playing!
                </p>
              )}
              
              {address && balance !== undefined && (
                <p className="text-sm text-gray-600">
                  Your balance: {formatEther(balance)} cUSD
                </p>
              )}
            </div>
            
            {address && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center justify-center gap-2 text-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">
                    💡 Pro Tip: Answer quickly to maximize your score and earnings!
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📚 How to Play
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">Connect Wallet</h3>
              <p className="text-sm text-gray-600">
                Connect your MiniPay or any Celo wallet to get started
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">Answer Questions</h3>
              <p className="text-sm text-gray-600">
                Answer 5 questions about Celo and blockchain in 2.5 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">Win Rewards</h3>
              <p className="text-sm text-gray-600">
                Top scorers win cUSD rewards automatically!
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
