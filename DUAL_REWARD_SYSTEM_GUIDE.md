# 🎁 Dual Reward System - Complete Guide

## ✨ Two Ways to Earn!

Your trivia game now has **TWO separate reward systems**:

1. **Instant Rewards** 💰 - Earn and claim after each game
2. **Weekly Leaderboard Rewards** 🏆 - Top 10 players get bonuses

---

## 💰 Instant Rewards (Per Game)

### How It Works

1. **Play Game** - Answer 10 questions (FREE)
2. **Earn Rewards** - Based on performance
3. **Claim Anytime** - Withdraw your earnings

### Earning Structure

| Performance | Reward |
|-------------|--------|
| Per Correct Answer | 0.01 cUSD |
| Perfect Score Bonus (10/10) | 0.05 cUSD |
| Speed Bonus | Up to 0.02 cUSD |
| **Max Per Game** | **0.17 cUSD** |

### Example Earnings

#### Perfect Game 🌟
- **Score:** 10/10 correct
- **Time:** 2 minutes
- **Breakdown:**
  - Base: 10 × 0.01 = 0.10 cUSD
  - Perfect Bonus: 0.05 cUSD
  - Speed Bonus: 0.02 cUSD
  - **Total: 0.17 cUSD**

#### Good Game ⭐
- **Score:** 8/10 correct
- **Time:** 3 minutes
- **Breakdown:**
  - Base: 8 × 0.01 = 0.08 cUSD
  - Perfect Bonus: 0 cUSD
  - Speed Bonus: 0.015 cUSD
  - **Total: 0.095 cUSD**

#### Average Game
- **Score:** 6/10 correct
- **Time:** 4 minutes
- **Breakdown:**
  - Base: 6 × 0.01 = 0.06 cUSD
  - Perfect Bonus: 0 cUSD
  - Speed Bonus: 0.01 cUSD
  - **Total: 0.07 cUSD**

### Claiming Rewards

#### Option 1: Claim All Pending Rewards
```solidity
claimRewards()
```
- Claims all unclaimed rewards at once
- Gas efficient (one transaction)
- Recommended for most users

#### Option 2: Claim Specific Sessions
```solidity
claimSessionRewards([0, 1, 2])
```
- Claim rewards from specific game sessions
- Useful if you want to claim selectively

### Frontend Example

```typescript
// Check pending rewards
const { data: pendingRewards } = useContractRead({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'getPendingRewards',
  args: [address],
  watch: true,
});

// Claim all rewards
const { write: claimRewards } = useContractWrite({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'claimRewards',
});

// Show to user
<div>
  <p>Pending Rewards: {formatEther(pendingRewards)} cUSD</p>
  <button onClick={() => claimRewards()}>
    Claim {formatEther(pendingRewards)} cUSD
  </button>
</div>
```

---

## 🏆 Weekly Leaderboard Rewards

### How It Works

1. **Play Games** - Accumulate total score
2. **Climb Leaderboard** - Compete for top 100
3. **Weekly Distribution** - Top 10 get bonuses
4. **Automatic Payment** - Sent directly to wallet

### Reward Distribution (Top 10)

| Rank | Percentage | Example (100 cUSD pool) |
|------|-----------|------------------------|
| 🥇 1st | 40% | 40 cUSD |
| 🥈 2nd | 25% | 25 cUSD |
| 🥉 3rd | 15% | 15 cUSD |
| 4th | 10% | 10 cUSD |
| 5th | 5% | 5 cUSD |
| 6th | 2.5% | 2.5 cUSD |
| 7th | 1% | 1 cUSD |
| 8th | 0.5% | 0.5 cUSD |
| 9th | 0.5% | 0.5 cUSD |
| 10th | 0.5% | 0.5 cUSD |

### Weekly Pool Funding

The owner funds the weekly pool:

```solidity
fundRewards(100 * 10**18) // Fund with 100 cUSD
```

### Distribution Schedule

- **Frequency:** Every 7 days
- **Trigger:** Owner calls `distributeRewards()`
- **Payment:** Automatic to top 10 wallets
- **Reset:** Leaderboard continues (cumulative scores)

---

## 📊 Complete Earning Example

### Scenario: Active Player (1 Week)

#### Daily Activity
- **Games per day:** 5
- **Average score:** 7/10
- **Average reward:** 0.08 cUSD per game

#### Weekly Instant Rewards
- **Total games:** 35 (5 × 7 days)
- **Total earned:** 2.8 cUSD (35 × 0.08)
- **Claimed:** Anytime during the week

#### Weekly Leaderboard Bonus
- **Rank:** 3rd place
- **Bonus:** 15% of pool (15 cUSD if pool is 100)

#### Total Weekly Earnings
- **Instant Rewards:** 2.8 cUSD
- **Leaderboard Bonus:** 15 cUSD
- **Total:** **17.8 cUSD** 🎉

---

## 🎮 Player Flow

### Complete Journey

```
1. Register Username (FREE, one-time)
   ↓
2. Play Game (FREE)
   ↓
3. Complete Game
   ↓
4. Earn Instant Reward (0.01-0.17 cUSD)
   ├─→ Claim Now (optional)
   └─→ Accumulate & Claim Later
   ↓
5. Score Added to Leaderboard
   ↓
6. Repeat Steps 2-5 (unlimited)
   ↓
7. Weekly Distribution (if in top 10)
   ↓
8. Receive Leaderboard Bonus (automatic)
```

---

## 💡 Smart Contract Functions

### For Players

```solidity
// Start game (FREE)
function startGame() external returns (uint256 sessionId)

// Submit answers
function submitAnswers(uint256 sessionId, uint8[] calldata answers) external

// Claim all pending rewards
function claimRewards() external

// Claim specific session rewards
function claimSessionRewards(uint256[] calldata sessionIds) external

// View pending rewards
function getPendingRewards(address player) external view returns (uint256)

// View unclaimed sessions
function getUnclaimedSessions(address player) external view returns (uint256[])
```

### For Owner

```solidity
// Fund instant rewards pool
function fundRewards(uint256 amount) external onlyOwner

// Distribute weekly leaderboard rewards
function distributeRewards() external onlyOwner

// Check contract balance
function getContractBalance() external view returns (uint256)
```

---

## 🎨 UI Components

### 1. Pending Rewards Display

```typescript
<div className="rewards-card">
  <h3>Your Pending Rewards</h3>
  <p className="amount">{formatEther(pendingRewards)} cUSD</p>
  <button onClick={claimRewards}>
    Claim Now
  </button>
  <p className="unclaimed">
    {unclaimedSessions.length} unclaimed games
  </p>
</div>
```

### 2. Post-Game Reward Display

```typescript
<div className="game-complete">
  <h2>Game Complete!</h2>
  <p>Score: {correctCount}/10</p>
  <p className="reward">
    Earned: {formatEther(reward)} cUSD 💰
  </p>
  <button onClick={claimRewards}>
    Claim Reward
  </button>
  <button onClick={playAgain}>
    Play Again
  </button>
</div>
```

### 3. Leaderboard with Weekly Pool

```typescript
<div className="leaderboard">
  <h2>🏆 Leaderboard</h2>
  <p className="pool">
    Weekly Pool: {formatEther(weeklyPool)} cUSD
  </p>
  <p className="next">
    Next Distribution: {timeUntilDistribution}
  </p>
  
  <table>
    {leaderboard.map((player, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{player.username}</td>
        <td>{player.score}</td>
        <td>{getRewardPercentage(index)}</td>
      </tr>
    ))}
  </table>
</div>
```

### 4. Profile Stats

```typescript
<div className="profile">
  <h2>{username}</h2>
  
  <div className="stats">
    <div>
      <label>Pending Rewards</label>
      <value>{formatEther(pendingRewards)} cUSD</value>
    </div>
    
    <div>
      <label>Total Earned (All Time)</label>
      <value>{totalEarned} cUSD</value>
    </div>
    
    <div>
      <label>Leaderboard Rank</label>
      <value>#{rank}</value>
    </div>
    
    <div>
      <label>Games Played</label>
      <value>{gamesPlayed}</value>
    </div>
  </div>
  
  <button onClick={claimRewards}>
    Claim {formatEther(pendingRewards)} cUSD
  </button>
</div>
```

---

## 📈 Economics & Funding

### Instant Rewards Pool

**Requirements:**
- Average reward: 0.08 cUSD per game
- 1000 games/week: 80 cUSD needed
- Buffer: 20 cUSD
- **Total: ~100 cUSD/week**

### Weekly Leaderboard Pool

**Separate funding:**
- Owner decides amount
- Example: 100 cUSD/week
- Distributed to top 10 only

### Total Funding Needed

**For 1000 games/week:**
- Instant rewards: 100 cUSD
- Weekly leaderboard: 100 cUSD
- **Total: 200 cUSD/week**

### Monitoring & Refilling

```bash
# Check contract balance
cast call $CONTRACT_ADDRESS "getContractBalance()"

# Refill if low
cast send $CONTRACT_ADDRESS "fundRewards(uint256)" 100000000000000000000
```

---

## 🔐 Security Features

✅ **Separate Pools** - Instant and weekly rewards are separate  
✅ **Claim Control** - Players control when to claim  
✅ **No Double Claiming** - Sessions marked as claimed  
✅ **ReentrancyGuard** - Protected against reentrancy  
✅ **Owner-Only Funding** - Only owner can fund pools  
✅ **Emergency Withdraw** - Owner can recover funds  

---

## 🎯 Strategy Tips

### For Players

1. **Accumulate Rewards**
   - Play multiple games
   - Claim in batches to save gas

2. **Optimize for Leaderboard**
   - Play consistently
   - Aim for high scores
   - Speed matters for total score

3. **Timing**
   - Claim before weekly distribution
   - Play more near end of week for rank

### For Platform

1. **Fund Adequately**
   - Monitor contract balance
   - Set up auto-refill alerts
   - Keep 2-week buffer

2. **Promote Leaderboard**
   - Show weekly pool size
   - Highlight top players
   - Countdown to distribution

3. **Engagement**
   - Daily challenges
   - Streak bonuses
   - Special events

---

## 📋 Testing Checklist

- [ ] Deploy contract
- [ ] Fund instant rewards pool (100 cUSD)
- [ ] Fund weekly rewards pool (100 cUSD)
- [ ] Add 10+ questions
- [ ] Register username
- [ ] Play game
- [ ] Check pending rewards
- [ ] Claim rewards
- [ ] Verify balance updated
- [ ] Play multiple games
- [ ] Check leaderboard rank
- [ ] Test weekly distribution (owner)
- [ ] Verify top 10 received bonuses

---

## 🚀 Launch Checklist

- [ ] Deploy to mainnet
- [ ] Fund both pools adequately
- [ ] Set up monitoring alerts
- [ ] Create claim rewards UI
- [ ] Add leaderboard display
- [ ] Show pending rewards
- [ ] Test on MiniPay
- [ ] Document claiming process
- [ ] Launch!

---

**Your trivia game now has a complete dual reward system! 🎮💰🏆**

Players earn instant rewards for every game AND compete for weekly leaderboard bonuses!
