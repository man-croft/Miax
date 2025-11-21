# 🎮 Create Game #1 - Setup Guide

## Issue Detected

Your console shows:
```
Game state: 0
GameState.Open: 0
Game info: (8) [0n, '', 0n, 0n, 0n, 0n, 0n, 0]
```

This means **game #1 exists but is empty** (all values are 0). You need to call `createGame` on your TriviaGame contract.

---

## Solution: Create Game #1

### Option 1: Using Cast (Foundry) - RECOMMENDED

```bash
cd contracts

# Create game #1
cast send 0x90c9ba691da6a027bf8cc173ea5171c29b3f3673 \
  "createGame(string,uint256)" \
  "Celo Basics Quiz" 10 \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key YOUR_PRIVATE_KEY
```

Replace `YOUR_PRIVATE_KEY` with your deployer private key.

---

### Option 2: Using Remix

1. Go to https://remix.ethereum.org
2. Load your TriviaGame contract
3. Connect to Celo Alfajores network
4. At address: `0x90c9ba691da6a027bf8cc173ea5171c29b3f3673`
5. Call `createGame` with:
   - `title`: "Celo Basics Quiz"
   - `maxPlayers`: 10
6. Confirm transaction

---

### Option 3: Using Hardhat/Foundry Script

Create `contracts/script/CreateGame.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TriviaGame.sol";

contract CreateGameScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        TriviaGame triviaGame = TriviaGame(0x90c9ba691da6a027bf8cc173ea5171c29b3f3673);
        
        triviaGame.createGame("Celo Basics Quiz", 10);
        
        console.log("Game created successfully!");

        vm.stopBroadcast();
    }
}
```

Run it:
```bash
cd contracts
forge script script/CreateGame.s.sol:CreateGameScript \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast
```

---

## Verify Game Was Created

After creating the game, verify it worked:

```bash
# Check game info
cast call 0x90c9ba691da6a027bf8cc173ea5171c29b3f3673 \
  "games(uint256)" 1 \
  --rpc-url https://alfajores-forno.celo-testnet.org
```

You should see non-zero values for:
- id: 1
- title: "Celo Basics Quiz"
- entryFee: 100000000000000000 (0.1 cUSD in wei)
- maxPlayers: 10
- state: 0 (Open)

---

## After Creating the Game

1. Refresh your frontend
2. Click "Start Playing Now"
3. The app should now:
   - Approve cUSD spending (if first time)
   - Join the game
   - Navigate to gameplay

---

## Troubleshooting

### "Only owner can create games"
- Make sure you're using the same wallet that deployed the contract
- The deployer address was: `0x1ff9ea9f062c31cff19ade558e34894f07cf7817`

### "Insufficient gas"
- Make sure you have CELO for gas fees
- Get test CELO from: https://faucet.celo.org

### Transaction fails
- Check you're on Celo Alfajores network
- Verify contract address is correct
- Check you have gas (CELO)

---

## Quick Command (Copy-Paste Ready)

```bash
# Replace YOUR_PRIVATE_KEY with your actual key
cast send 0x90c9ba691da6a027bf8cc173ea5171c29b3f3673 \
  "createGame(string,uint256)" \
  "Celo Basics Quiz" 10 \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key YOUR_PRIVATE_KEY
```

---

**After running this command, your app will work! 🎉**
