// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockVRFCoordinator.sol";
import "../src/TriviaGameV2.sol";

contract DeployWithMockVRF is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("===========================================");
        console.log("Deploying TriviaGameV2 with Mock VRF...");
        console.log("===========================================");
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy Mock VRF Coordinator
        console.log("Step 1: Deploying Mock VRF Coordinator...");
        MockVRFCoordinator vrfCoordinator = new MockVRFCoordinator();
        console.log("Mock VRF Coordinator:", address(vrfCoordinator));
        console.log("");

        // Step 2: Deploy TriviaGameV2 with Mock VRF
        console.log("Step 2: Deploying TriviaGameV2...");
        
        // Mock VRF configuration (these values don't matter for mock)
        uint64 subscriptionId = 1;
        bytes32 keyHash = bytes32(uint256(1));
        
        TriviaGameV2 triviaGame = new TriviaGameV2{value: 0}(
            address(vrfCoordinator),
            subscriptionId,
            keyHash
        );

        console.log("TriviaGameV2 deployed:", address(triviaGame));
        console.log("");
        console.log("===========================================");
        console.log("DEPLOYMENT COMPLETE!");
        console.log("===========================================");
        console.log("");
        console.log("Contract Addresses:");
        console.log("-------------------");
        console.log("Mock VRF Coordinator:", address(vrfCoordinator));
        console.log("TriviaGameV2:", address(triviaGame));
        console.log("");
        console.log("Game Parameters:");
        console.log("- Play Fee: FREE");
        console.log("- Rewards: Native CELO");
        console.log("- Questions Per Session: 10");
        console.log("- Time Limit: 5 minutes");
        console.log("- Reward Per Correct: 0.01 CELO");
        console.log("- Perfect Bonus: 0.05 CELO");
        console.log("- Max Speed Bonus: 0.02 CELO");
        console.log("- Leaderboard Size: Top 100");
        console.log("- Weekly Rewards: Top 10");
        console.log("");
        console.log("===========================================");
        console.log("IMPORTANT NOTES:");
        console.log("===========================================");
        console.log("1. Using MOCK VRF (pseudo-random)");
        console.log("2. Random numbers generated using block data");
        console.log("3. When Chainlink VRF is available on Celo:");
        console.log("   - Deploy new TriviaGameV2 with real VRF");
        console.log("   - Or upgrade to use real VRF coordinator");
        console.log("");
        console.log("NEXT STEPS:");
        console.log("===========================================");
        console.log("1. Fund contract with CELO:");
        console.log("   cast send", address(triviaGame), "--value 10ether");
        console.log("");
        console.log("2. Add questions (minimum 10):");
        console.log("   forge script script/AddQuestions.s.sol --broadcast");
        console.log("");
        console.log("3. Test the game:");
        console.log("   - Register username");
        console.log("   - Start game (VRF will work with mock)");
        console.log("   - Answer questions");
        console.log("   - Claim rewards");
        console.log("===========================================");

        vm.stopBroadcast();
    }
}
