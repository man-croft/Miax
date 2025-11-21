# 🚀 QUICK START - Testing Your Integrated App

## ⚡ Prerequisites

Before testing, you need to:

### 1. Create Game #1 in TriviaGame Contract

The app expects game ID 1 to exist. You need to call `createGame` on your deployed contract.

**Contract Address:** `0x90c9ba691da6a027bf8cc173ea5171c29b3f3673`

**Method:** `createGame(string title, uint256 maxPlayers)`

**Parameters:**
- `title`: "Celo Basics Quiz"
- `maxPlayers`: 10

**Using Remix or Hardhat:**
```javascript
await triviaGame.createGame("Celo Basics Quiz", 10);
```

**Using Cast (Foundry):**
```bash
cast send 0x90c9ba691da6a027bf8cc173ea5171c29b3f3673 \
  "createGame(string,uint256)" \
  "Celo Basics Quiz" 10 \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key YOUR_PRIVATE_KEY
```

---

### 2. Fund the Faucet Contract

The faucet needs cUSD to distribute to users.

**Faucet Address:** `0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d`  
**Recommended Amount:** 100+ cUSD

**Steps:**
1. Get test cUSD from Celo Faucet: https://faucet.celo.org
2. Transfer cUSD to faucet contract address

**Using Cast:**
```bash
# Transfer 100 cUSD to faucet
cast send 0x765DE816845861e75A25fCA122bb6898B8B1282a \
  "transfer(address,uint256)" \
  0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d \
  100000000000000000000 \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key YOUR_PRIVATE_KEY
```

---

### 3. Start the Frontend

```bash
cd frontend
npm install  # if not already done
npm run dev
```

Open http://localhost:3000

---

## 🧪 Testing Flow

### Test 1: Connect Wallet
1. ✅ Open app in browser
2. ✅ Click "Connect Wallet" in navbar
3. ✅ Connect with MetaMask/MiniPay on Celo Sepolia
4. ✅ Verify wallet address shows in navbar

---

### Test 2: View Game Data
1. ✅ Navigate to /play page
2. ✅ Check if prize pool shows (should be 0 initially)
3. ✅ Check if entry fee shows (0.1 cUSD)
4. ✅ Check if player count shows (0/10)
5. ✅ Verify data is loading from contract

**Expected:** Real data from blockchain, not mock data

---

### Test 3: Auto-Faucet (New Wallet)
1. ✅ Use a wallet with 0 cUSD balance
2. ✅ Click "Start Playing Now"
3. ✅ Should see: "Getting you some cUSD from faucet..."
4. ✅ Should see: "Received 10 cUSD! Now joining game..."
5. ✅ Check balance increased to 10 cUSD

**Expected:** Automatic faucet claim before joining game

---

### Test 4: Join Game
1. ✅ Click "Start Playing Now"
2. ✅ Approve cUSD spending (if first time)
3. ✅ Confirm transaction in wallet
4. ✅ Wait for transaction confirmation
5. ✅ Should see: "Successfully joined the game!"
6. ✅ Should navigate to /play/game

**Expected:** Transaction on blockchain, navigation to game

---

### Test 5: Verify on Blockchain
1. ✅ Check transaction on Celoscan
2. ✅ Verify PlayerJoined event emitted
3. ✅ Check game state updated
4. ✅ Verify prize pool increased by 0.1 cUSD

**Celoscan:** https://sepolia.celoscan.io/

---

### Test 6: Already Joined
1. ✅ Go back to /play page
2. ✅ Click "Continue Playing"
3. ✅ Should skip join transaction
4. ✅ Should navigate directly to game

**Expected:** No duplicate join, direct navigation

---

### Test 7: Mobile Testing
1. ✅ Open on mobile device
2. ✅ Test hamburger menu
3. ✅ Test wallet connection
4. ✅ Test join flow
5. ✅ Verify responsive design

**Expected:** Fully functional on mobile

---

## 🐛 Troubleshooting

### Issue: "Game is not open for joining"
**Solution:** Game #1 doesn't exist or is not in Open state
```bash
# Check game state
cast call 0x90c9ba691da6a027bf8cc173ea5171c29b3f3673 \
  "getGameState(uint256)" 1 \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

---

### Issue: "Insufficient balance" or "Transfer failed"
**Solution:** Faucet contract has no cUSD
```bash
# Check faucet balance
cast call 0x765DE816845861e75A25fCA122bb6898B8B1282a \
  "balanceOf(address)" 0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

---

### Issue: "Already claimed"
**Solution:** Wallet already claimed from faucet
- Use a different wallet, OR
- Get cUSD from Celo faucet directly

---

### Issue: Game data not loading
**Solution:** Check environment variables
```bash
# Verify .env.local exists
cat frontend/.env.local

# Should show:
# NEXT_PUBLIC_TRIVIA_GAME_ADDRESS=0x90c9ba691da6a027bf8cc173ea5171c29b3f3673
```

---

### Issue: Transaction fails
**Solutions:**
1. Check you have CELO for gas fees
2. Check cUSD approval
3. Check game is in Open state
4. Check you haven't already joined

---

## 📋 Pre-Flight Checklist

Before testing, verify:

- [ ] Game #1 created in TriviaGame contract
- [ ] Game #1 is in Open state (state = 0)
- [ ] Faucet has cUSD balance (100+ recommended)
- [ ] Frontend .env.local has correct addresses
- [ ] Wallet has CELO for gas fees
- [ ] Connected to Celo Sepolia network
- [ ] Frontend dev server running

---

## 🔍 Useful Commands

### Check Game Info
```bash
cast call 0x90c9ba691da6a027bf8cc173ea5171c29b3f3673 \
  "games(uint256)" 1 \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

### Check Prize Pool
```bash
cast call 0x90c9ba691da6a027bf8cc173ea5171c29b3f3673 \
  "getGamePrizePool(uint256)" 1 \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

### Check Players
```bash
cast call 0x90c9ba691da6a027bf8cc173ea5171c29b3f3673 \
  "getPlayers(uint256)" 1 \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

### Check if Claimed
```bash
cast call 0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d \
  "hasClaimed(address)" YOUR_WALLET_ADDRESS \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

---

## 🎥 Recording Demo Video

When everything works, record your demo:

### Demo Script (4 minutes):

**0:00-0:30 - Introduction**
- Show landing page
- Explain the concept
- Show problem/solution

**0:30-1:30 - Wallet & Setup**
- Connect wallet
- Show auto-faucet message
- Show balance

**1:30-2:30 - Join Game**
- Click "Start Playing Now"
- Show auto-faucet claiming
- Show join transaction
- Show success message

**2:30-3:30 - Gameplay (if ready)**
- Show questions
- Answer questions
- Show results

**3:30-4:00 - Technical**
- Show contract on Celoscan
- Show transaction
- Mention tech stack
- Thank you

---

## ✅ Success Criteria

Your app is ready when:

- ✅ Game data loads from contract
- ✅ Auto-faucet works for new wallets
- ✅ Join game transaction succeeds
- ✅ Transaction visible on Celoscan
- ✅ Prize pool increases after join
- ✅ Player count updates
- ✅ Works on mobile
- ✅ Error handling works
- ✅ Loading states show correctly

---

## 🚀 Next Steps After Testing

1. ✅ Fix any bugs found
2. ✅ Test on actual mobile device
3. ✅ Verify contracts on Celoscan
4. ✅ Record demo video
5. ✅ Update README
6. ✅ Take screenshots
7. ✅ Prepare submission
8. ✅ Submit to hackathon!

---

**Good luck with testing! 🍀**

**Need help?** Check the troubleshooting section or review the contract deployment details.
