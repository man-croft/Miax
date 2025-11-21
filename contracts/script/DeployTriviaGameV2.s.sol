// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TriviaGameV2.sol";

contract DeployTriviaGameV2 is Script {
    // Chainlink VRF Coordinator for Celo Alfajores
    // Note: You'll need to get the actual VRF coordinator address for Celo
    // For now, using a placeholder - UPDATE THIS!
    address constant VRF_COORDINATOR = 0x0000000000000000000000000000000000000000; // UPDATE!
    
    // VRF Configuration
    uint64 constant SUBSCRIPTION_ID = 0; // UPDATE with your subscription ID
    bytes32 constant KEY_HASH = 0x0000000000000000000000000000000000000000000000000000000000000000; // UPDATE!
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TriviaGameV2 (rewards in native CELO)
        TriviaGameV2 triviaGame = new TriviaGameV2{value: 0}(
            VRF_COORDINATOR,
            SUBSCRIPTION_ID,
            KEY_HASH
        );

        console.log("===========================================");
        console.log("TriviaGameV2 (Leaderboard) deployed!");
        console.log("===========================================");
        console.log("Contract Address:", address(triviaGame));
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
        console.log("===========================================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Add contract to VRF subscription");
        console.log("2. Fund contract with CELO for rewards");
        console.log("3. Add questions (minimum 10)");
        console.log("4. Players register usernames");
        console.log("5. Players start playing and earning CELO!");
        console.log("===========================================");

        vm.stopBroadcast();
    }
}
