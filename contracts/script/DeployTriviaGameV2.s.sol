// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TriviaGameV2.sol";

contract DeployTriviaGameV2 is Script {
    // Chainlink VRF Coordinator for Base Sepolia
    // https://docs.chain.link/vrf/v2/subscription/supported-networks#base-sepolia-testnet
    address constant VRF_COORDINATOR = 0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE;

    // VRF Configuration for Base Sepolia
    uint64 constant SUBSCRIPTION_ID = 0; // UPDATE with your subscription ID after creating one
    bytes32 constant KEY_HASH = 0x9e9e46732b32662b9adc6f3abdf6c5e926a666d174a4d6b8e39c7b2f7c3f0c90; // 500 gwei key hash
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TriviaGameV2 (rewards in native ETH on Base)
        TriviaGameV2 triviaGame = new TriviaGameV2{value: 0}(
            VRF_COORDINATOR,
            SUBSCRIPTION_ID,
            KEY_HASH
        );

        console.log("===========================================");
        console.log("TriviaGameV2 (Leaderboard) deployed on Base!");
        console.log("===========================================");
        console.log("Contract Address:", address(triviaGame));
        console.log("");
        console.log("Game Parameters:");
        console.log("- Play Fee: FREE");
        console.log("- Rewards: Native ETH");
        console.log("- Questions Per Session: 10");
        console.log("- Time Limit: 5 minutes");
        console.log("- Reward Per Correct: 0.001 ETH");
        console.log("- Perfect Bonus: 0.005 ETH");
        console.log("- Max Speed Bonus: 0.002 ETH");
        console.log("- Leaderboard Size: Top 100");
        console.log("- Weekly Rewards: Top 10");
        console.log("===========================================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Create Chainlink VRF subscription at https://vrf.chain.link");
        console.log("2. Add contract to VRF subscription");
        console.log("3. Fund contract with ETH for rewards");
        console.log("4. Add questions (minimum 10)");
        console.log("5. Players register usernames");
        console.log("6. Players start playing and earning ETH!");
        console.log("===========================================");

        vm.stopBroadcast();
    }
}
