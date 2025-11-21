# 💎 Native CELO Rewards - Complete Guide

## ✨ Earn Native CELO!

Your trivia game now pays rewards in **native CELO** instead of cUSD tokens!

### Why Native CELO?

✅ **No Token Approvals** - No need to approve ERC20 transfers  
✅ **Simpler UX** - Direct CELO transfers  
✅ **Lower Gas** - Native transfers are cheaper  
✅ **Universal** - CELO is the base currency  
✅ **MiniPay Compatible** - Works seamlessly with MiniPay  

---

## 💰 Earning Structure (in CELO)

### Instant Rewards

| Performance | Reward (CELO) |
|-------------|---------------|
| Per Correct Answer | 0.01 CELO |
| Perfect Score Bonus (10/10) | 0.05 CELO |
| Speed Bonus | Up to 0.02 CELO |
| **Max Per Game** | **0.17 CELO** |

### Example Earnings

#### Perfect Game 🌟
- **Score:** 10/10 correct
- **Time:** 2 minutes
- **Earnings:**
  - Base: 10 × 0.01 = 0.10 CELO
  - Perfect Bonus: 0.05 CELO
  - Speed Bonus: 0.02 CELO
  - **Total: 0.17 CELO**

#### Good Game ⭐
- **Score:** 8/10 correct
- **Time:** 3 minutes
- **Earnings:**
  - Base: 8 × 0.01 = 0.08 CELO
  - Speed Bonus: 0.015 CELO
  - **Total: 0.095 CELO**

#### Average Game
- **Score:** 6/10 correct
- **Time:** 4 minutes
- **Earnings:**
  - Base: 6 × 0.01 = 0.06 CELO
  - Speed Bonus: 0.01 CELO
  - **Total: 0.07 CELO**

---

## 🎮 How It Works

### 1. Play Game (FREE)
```
No payment required!
```

### 2. Earn CELO
```
Rewards calculated based on:
- Correct answers
- Perfect score bonus
- Speed bonus
```

### 3. Claim Rewards
```solidity
claimRewards()
```
- CELO sent directly to your wallet
- No token approvals needed
- Instant transfer

---

## 🔧 Smart Contract Changes

### Removed
- ❌ `IERC20 cUSDToken` - No more token dependency
- ❌ Token transfer approvals
- ❌ `transferFrom` calls

### Added
- ✅ Native CELO transfers via `call{value: amount}`
- ✅ `receive()` function to accept CELO
- ✅ `payable` modifiers
- ✅ Direct balance checks with `address(this).balance`

### Updated Functions

```solidity
// Constructor - now payable, no cUSD address
constructor(
    address _vrfCoordinator,
    uint64 _subscriptionId,
    bytes32 _keyHash
) payable

// Update username - now costs CELO
function updateUsername(string memory newUsername) external payable

// Claim rewards - sends CELO
function claimRewards() external

// Fund rewards - sends CELO
function fundRewards() external payable onlyOwner

// Receive CELO
receive() external payable
```

---

## 🚀 Deployment

### Step 1: Deploy Contract

```bash
cd contracts

forge script script/DeployTriviaGameV2.s.sol:DeployTriviaGameV2 \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast \
  --verify
```

### Step 2: Fund Contract with CELO

```bash
# Fund with 10 CELO for rewards
cast send $CONTRACT_ADDRESS \
  "fundRewards()" \
  --value 10ether \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key $PRIVATE_KEY

# Or send CELO directly (uses receive function)
cast send $CONTRACT_ADDRESS \
  --value 10ether \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key $PRIVATE_KEY
```

### Step 3: Add Questions

```bash
forge script script/AddQuestions.s.sol:AddQuestions \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast
```

### Step 4: Test!

Players can now:
1. Register username (FREE)
2. Play games (FREE)
3. Earn CELO
4. Claim CELO rewards

---

## 📱 Frontend Integration

### No Token Approvals Needed!

```typescript
// OLD (with cUSD)
const { write: approve } = useContractWrite({
  address: cUSD_ADDRESS,
  abi: ERC20_ABI,
  functionName: 'approve',
});

await approve({ args: [CONTRACT_ADDRESS, amount] });

// NEW (with CELO)
// No approval needed! Just claim directly
const { write: claim } = useContractWrite({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'claimRewards',
});

await claim();
```

### Check Pending Rewards

```typescript
const { data: pendingRewards } = useContractRead({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'getPendingRewards',
  args: [address],
  watch: true,
});

// Display
<div>
  <p>Pending: {formatEther(pendingRewards)} CELO</p>
  <button onClick={() => claimRewards()}>
    Claim {formatEther(pendingRewards)} CELO
  </button>
</div>
```

### Check CELO Balance

```typescript
const { data: balance } = useBalance({
  address: address,
  // No token parameter needed for native CELO
  watch: true,
});

<p>Balance: {formatEther(balance?.value)} CELO</p>
```

### Update Username (Costs CELO)

```typescript
const { write: updateUsername } = useContractWrite({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'updateUsername',
});

// Send 0.01 CELO with the call
await updateUsername({
  args: [newUsername],
  value: parseEther('0.01'),
});
```

---

## 💡 Economics

### Funding Requirements

**For 1000 games/week:**
- Average reward: 0.08 CELO per game
- Instant rewards: 80 CELO
- Weekly leaderboard: 20 CELO
- **Total: ~100 CELO/week**

### Monitoring Balance

```bash
# Check contract balance
cast balance $CONTRACT_ADDRESS \
  --rpc-url https://alfajores-forno.celo-testnet.org

# Or use contract function
cast call $CONTRACT_ADDRESS \
  "getContractBalance()" \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

### Auto-Refill Script

```bash
#!/bin/bash

CONTRACT_ADDRESS="0xYourContractAddress"
MIN_BALANCE="50000000000000000000" # 50 CELO
REFILL_AMOUNT="100000000000000000000" # 100 CELO

# Check balance
BALANCE=$(cast balance $CONTRACT_ADDRESS --rpc-url https://alfajores-forno.celo-testnet.org)

# Refill if low
if [ "$BALANCE" -lt "$MIN_BALANCE" ]; then
  echo "Balance low, refilling..."
  cast send $CONTRACT_ADDRESS \
    --value $REFILL_AMOUNT \
    --rpc-url https://alfajores-forno.celo-testnet.org \
    --private-key $PRIVATE_KEY
fi
```

---

## 🎨 UI Examples

### Claim Rewards Button

```typescript
function ClaimRewardsButton() {
  const { address } = useAccount();
  const { data: pending } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getPendingRewards',
    args: [address],
  });
  
  const { write: claim, isLoading } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'claimRewards',
  });
  
  return (
    <button
      onClick={() => claim()}
      disabled={!pending || pending === 0n || isLoading}
      className="claim-button"
    >
      {isLoading ? (
        'Claiming...'
      ) : (
        `Claim ${formatEther(pending || 0n)} CELO`
      )}
    </button>
  );
}
```

### Post-Game Reward Display

```typescript
function GameComplete({ sessionId }) {
  const { address } = useAccount();
  const { data: session } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getSession',
    args: [address, sessionId],
  });
  
  return (
    <div className="game-complete">
      <h2>🎉 Game Complete!</h2>
      <div className="score">
        <p>Score: {session?.correctCount}/10</p>
        <p className="reward">
          Earned: {formatEther(session?.reward || 0n)} CELO 💎
        </p>
      </div>
      
      <div className="actions">
        <button onClick={claimRewards}>
          Claim CELO
        </button>
        <button onClick={playAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
```

### Balance Display

```typescript
function WalletBalance() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: pending } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getPendingRewards',
    args: [address],
  });
  
  return (
    <div className="balance-card">
      <div className="balance-item">
        <label>CELO Balance</label>
        <value>{formatEther(balance?.value || 0n)} CELO</value>
      </div>
      
      <div className="balance-item pending">
        <label>Pending Rewards</label>
        <value>{formatEther(pending || 0n)} CELO</value>
      </div>
      
      <div className="balance-item total">
        <label>Total Available</label>
        <value>
          {formatEther((balance?.value || 0n) + (pending || 0n))} CELO
        </value>
      </div>
    </div>
  );
}
```

---

## 🔐 Security

✅ **Native Transfers** - More secure than token transfers  
✅ **ReentrancyGuard** - Protected against reentrancy  
✅ **Balance Checks** - Ensures sufficient funds  
✅ **Owner Controls** - Only owner can fund/withdraw  
✅ **No Approvals** - Eliminates approval attack vectors  

---

## 📊 Comparison: cUSD vs CELO

| Feature | cUSD (Old) | CELO (New) |
|---------|-----------|------------|
| Token Type | ERC20 | Native |
| Approvals | Required | Not needed |
| Gas Cost | Higher | Lower |
| UX | 2 transactions | 1 transaction |
| Complexity | More complex | Simpler |
| MiniPay | Supported | Supported |

---

## 🎯 Benefits

### For Players
- ✅ **Simpler** - No token approvals
- ✅ **Faster** - One transaction to claim
- ✅ **Cheaper** - Lower gas fees
- ✅ **Universal** - CELO works everywhere

### For Developers
- ✅ **Less Code** - No ERC20 handling
- ✅ **Fewer Errors** - Simpler logic
- ✅ **Better UX** - Smoother flow
- ✅ **Lower Maintenance** - Less complexity

---

## 📋 Migration Checklist

- [ ] Deploy new contract (no cUSD address)
- [ ] Fund with CELO (not cUSD)
- [ ] Update frontend (remove token approvals)
- [ ] Test claiming CELO
- [ ] Update UI to show CELO
- [ ] Test on MiniPay
- [ ] Monitor CELO balance
- [ ] Launch!

---

## 🚀 Quick Start Commands

```bash
# Deploy
forge script script/DeployTriviaGameV2.s.sol:DeployTriviaGameV2 \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast

# Fund with 100 CELO
cast send $CONTRACT_ADDRESS \
  --value 100ether \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key $PRIVATE_KEY

# Check balance
cast balance $CONTRACT_ADDRESS \
  --rpc-url https://alfajores-forno.celo-testnet.org

# Add questions
forge script script/AddQuestions.s.sol:AddQuestions \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast
```

---

**Your trivia game now pays rewards in native CELO! 💎🎮**

Simpler, faster, and more user-friendly than ever before!
