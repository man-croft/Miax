# 🎨 Frontend Integration Guide - TriviaGameV2

## ✅ Integration Complete!

Your frontend has been updated to use the new **TriviaGameV2** contract with all new features!

---

## 📋 What Was Updated

### 1. Contract Configuration (`frontend/src/config/contracts.ts`)
- ✅ Updated to use TriviaGameV2 ABI
- ✅ Added new contract address: `0xc4AE01295cfAE3DA96b044F1a4284A93837a644C`
- ✅ Added MockVRF address: `0x499BABaB30D2820EaF1814ce74cbDd50cb2ecCC9`
- ✅ Added game constants (rewards, time limits, etc.)
- ✅ Added question categories

### 2. Hooks (`frontend/src/hooks/useContract.ts`)
- ✅ `usePlayerRegistration()` - Username registration and management
- ✅ `useGameSession()` - Start games and submit answers
- ✅ `useSession()` - Get session details
- ✅ `useQuestions()` - Fetch questions
- ✅ `useRewards()` - Claim rewards
- ✅ `useLeaderboard()` - Get leaderboard data
- ✅ `useContractInfo()` - Contract stats
- ✅ `useCeloBalance()` - CELO balance

### 3. ABI File
- ✅ Extracted TriviaGameV2 ABI to `frontend/src/config/TriviaGameV2ABI.json`

---

## 🚀 Environment Variables

Update your `.env.local` file:

```env
# TriviaGameV2 Contract
NEXT_PUBLIC_TRIVIA_GAME_V2_ADDRESS=0xc4AE01295cfAE3DA96b044F1a4284A93837a644C

# MockVRF Coordinator
NEXT_PUBLIC_MOCK_VRF_ADDRESS=0x499BABaB30D2820EaF1814ce74cbDd50cb2ecCC9

# Network
NEXT_PUBLIC_NETWORK=celo-sepolia
NEXT_PUBLIC_RPC_URL=https://rpc.ankr.com/celo_sepolia

# Legacy (keep for faucet)
NEXT_PUBLIC_FAUCET_ADDRESS=0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d
```

---

## 📱 New Features to Implement

### 1. Username Registration Page

Create `frontend/src/app/register/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { usePlayerRegistration } from '@/hooks/useContract';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const { 
    isRegistered, 
    registerUsername, 
    registerIsLoading, 
    registerIsSuccess 
  } = usePlayerRegistration();

  const handleRegister = async () => {
    if (username.length >= 3 && username.length <= 20) {
      await registerUsername?.({ args: [username] });
    }
  };

  if (isRegistered) {
    return <div>Already registered!</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Register Username</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username (3-20 characters)"
        className="border p-2 rounded w-full max-w-md"
        minLength={3}
        maxLength={20}
      />
      <button
        onClick={handleRegister}
        disabled={registerIsLoading || username.length < 3}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
      >
        {registerIsLoading ? 'Registering...' : 'Register'}
      </button>
      {registerIsSuccess && <p className="text-green-500 mt-2">Registered successfully!</p>}
    </div>
  );
}
```

### 2. Updated Play Page

Update `frontend/src/app/play/page.tsx`:

```typescript
'use client';

import { usePlayerRegistration, useGameSession, useCeloBalance } from '@/hooks/useContract';
import { useRouter } from 'next/navigation';

export default function PlayPage() {
  const router = useRouter();
  const { isRegistered } = usePlayerRegistration();
  const { startGame, startGameIsLoading, startGameIsSuccess } = useGameSession();
  const { balance } = useCeloBalance();

  const handleStartGame = async () => {
    if (!isRegistered) {
      router.push('/register');
      return;
    }
    await startGame?.();
  };

  if (startGameIsSuccess) {
    router.push('/play/game');
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Play Trivia</h1>
      
      <div className="mb-4">
        <p>CELO Balance: {balance} CELO</p>
        <p>Game is FREE to play!</p>
        <p>Earn up to 0.17 CELO per game</p>
      </div>

      {!isRegistered && (
        <div className="bg-yellow-100 p-4 rounded mb-4">
          <p>You need to register a username first!</p>
          <button
            onClick={() => router.push('/register')}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Register Now
          </button>
        </div>
      )}

      <button
        onClick={handleStartGame}
        disabled={startGameIsLoading}
        className="bg-green-500 text-white px-8 py-4 rounded-lg text-xl"
      >
        {startGameIsLoading ? 'Starting Game...' : 'Start Game (FREE)'}
      </button>
    </div>
  );
}
```

### 3. Rewards Page

Create `frontend/src/app/rewards/page.tsx`:

```typescript
'use client';

import { useRewards, useCeloBalance } from '@/hooks/useContract';

export default function RewardsPage() {
  const { 
    pendingRewards, 
    unclaimedSessions, 
    claimRewards, 
    claimIsLoading, 
    claimIsSuccess 
  } = useRewards();
  const { balance } = useCeloBalance();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Rewards</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">CELO Balance</h2>
          <p className="text-3xl font-bold text-blue-600">{balance} CELO</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Pending Rewards</h2>
          <p className="text-3xl font-bold text-green-600">{pendingRewards} CELO</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Unclaimed Games</h2>
        <p className="mb-4">{unclaimedSessions.length} games with unclaimed rewards</p>
        
        <button
          onClick={() => claimRewards?.()}
          disabled={claimIsLoading || Number(pendingRewards) === 0}
          className="bg-green-500 text-white px-6 py-3 rounded-lg disabled:bg-gray-300"
        >
          {claimIsLoading ? 'Claiming...' : `Claim ${pendingRewards} CELO`}
        </button>

        {claimIsSuccess && (
          <p className="text-green-500 mt-4">Rewards claimed successfully! 🎉</p>
        )}
      </div>
    </div>
  );
}
```

### 4. Leaderboard Page

Create `frontend/src/app/leaderboard/page.tsx`:

```typescript
'use client';

import { useLeaderboard } from '@/hooks/useContract';

export default function LeaderboardPage() {
  const { leaderboardData } = useLeaderboard(10);

  const addresses = leaderboardData?.[0] as `0x${string}`[] || [];
  const usernames = leaderboardData?.[1] as string[] || [];
  const scores = leaderboardData?.[2] as bigint[] || [];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>
      <p className="mb-4">Top 10 Players - Weekly Rewards!</p>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Score</th>
              <th className="p-4 text-left">Reward %</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address, index) => (
              <tr key={address} className="border-t">
                <td className="p-4">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td className="p-4 font-semibold">{usernames[index]}</td>
                <td className="p-4">{scores[index]?.toString()}</td>
                <td className="p-4">
                  {index === 0 && '40%'}
                  {index === 1 && '25%'}
                  {index === 2 && '15%'}
                  {index === 3 && '10%'}
                  {index === 4 && '5%'}
                  {index > 4 && '< 3%'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 5. Profile Page

Create `frontend/src/app/profile/page.tsx`:

```typescript
'use client';

import { usePlayerRegistration, useRewards, useCeloBalance } from '@/hooks/useContract';

export default function ProfilePage() {
  const { playerInfo } = usePlayerRegistration();
  const { pendingRewards } = useRewards();
  const { balance } = useCeloBalance();

  const username = playerInfo?.[0] as string || '';
  const totalScore = playerInfo?.[1] as bigint || 0n;
  const gamesPlayed = playerInfo?.[2] as bigint || 0n;
  const correctAnswers = playerInfo?.[3] as bigint || 0n;
  const totalQuestions = playerInfo?.[4] as bigint || 0n;
  const bestScore = playerInfo?.[5] as bigint || 0n;
  const rank = playerInfo?.[6] as bigint || 0n;

  const accuracy = totalQuestions > 0n 
    ? (Number(correctAnswers) / Number(totalQuestions) * 100).toFixed(1)
    : '0';

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">{username}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600">Rank</p>
            <p className="text-2xl font-bold">#{rank.toString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Score</p>
            <p className="text-2xl font-bold">{totalScore.toString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Games Played</p>
            <p className="text-2xl font-bold">{gamesPlayed.toString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Best Score</p>
            <p className="text-2xl font-bold">{bestScore.toString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Accuracy</h3>
          <p className="text-3xl font-bold text-blue-600">{accuracy}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">CELO Balance</h3>
          <p className="text-3xl font-bold text-green-600">{balance}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Pending Rewards</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingRewards}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎮 Game Flow

### Complete User Journey:

1. **First Time User:**
   - Connect wallet (MiniPay or other)
   - Register username (FREE)
   - Start game (FREE)
   - Answer 10 questions
   - Earn CELO rewards
   - Claim rewards

2. **Returning User:**
   - Connect wallet
   - Start game (FREE)
   - Answer questions
   - Earn more rewards
   - Check leaderboard
   - Claim accumulated rewards

---

## 📊 Key Differences from Old Contract

| Feature | Old (TriviaGame) | New (TriviaGameV2) |
|---------|------------------|-------------------|
| **Entry Fee** | 0.1 cUSD | FREE |
| **Rewards** | Prize pool split | Instant CELO earnings |
| **Game Model** | Wait for 10 players | Play anytime |
| **Questions** | Fixed | 10 random from 35+ |
| **Username** | No | Yes, required |
| **Leaderboard** | No | Yes, top 100 |
| **Claiming** | Automatic | Manual claim |
| **VRF** | No | Yes (Mock VRF) |

---

## 🔧 Testing Checklist

- [ ] Connect wallet
- [ ] Register username
- [ ] Check CELO balance
- [ ] Start game
- [ ] Wait for VRF to assign questions
- [ ] Answer questions
- [ ] Submit answers
- [ ] Check pending rewards
- [ ] Claim rewards
- [ ] View leaderboard
- [ ] Check profile stats

---

## 📝 Next Steps

1. **Update existing pages** to use new hooks
2. **Create new pages** (register, rewards, leaderboard, profile)
3. **Update navigation** to include new pages
4. **Test on MiniPay** mobile app
5. **Add loading states** and error handling
6. **Implement question fetching** logic
7. **Add animations** and better UX

---

## 🎨 UI Components Needed

### New Components:
- `UsernameInput` - Username registration form
- `RewardsCard` - Display pending rewards
- `LeaderboardTable` - Top players table
- `ProfileStats` - Player statistics
- `ClaimButton` - Claim rewards button
- `GameTimer` - 5-minute countdown
- `ScoreDisplay` - Show score with speed bonus

---

## 💡 Tips

1. **Always check `isRegistered`** before allowing gameplay
2. **Show pending rewards** prominently to encourage claiming
3. **Display leaderboard** to create competition
4. **Use loading states** for better UX
5. **Handle errors gracefully** with user-friendly messages
6. **Test on mobile** (MiniPay) for best experience

---

**Your frontend is ready to integrate with TriviaGameV2! 🎮🚀**

Start by creating the new pages and updating the navigation!
