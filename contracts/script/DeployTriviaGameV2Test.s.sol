// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TriviaGameV2.sol";

contract DeployTriviaGameV2Test is Script {
    // Using placeholder addresses for testing
    // NOTE: This will deploy but VRF won't work until properly configured
    address constant VRF_COORDINATOR = 0x0000000000000000000000000000000000000001; // Placeholder
    uint64 constant SUBSCRIPTION_ID = 1; // Placeholder
    bytes32 constant KEY_HASH = bytes32(uint256(1)); // Placeholder
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("===========================================");
        console.log("Deploying TriviaGameV2 to Celo Sepolia...");
        console.log("===========================================");
        console.log("WARNING: Using placeholder VRF values");
        console.log("VRF functionality will NOT work until configured");
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TriviaGameV2 with placeholder VRF
        TriviaGameV2 triviaGame = new TriviaGameV2{value: 0}(
            VRF_COORDINATOR,
            SUBSCRIPTION_ID,
            KEY_HASH
        );

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
        console.log("===========================================");
        console.log("");
        console.log("IMPORTANT NEXT STEPS:");
        console.log("1. Fund contract with CELO:");
        console.log("   cast send", address(triviaGame), "--value 10ether");
        console.log("");
        console.log("2. Configure Chainlink VRF (when available)");
        console.log("");
        console.log("3. Add questions:");
        console.log("   forge script script/AddQuestions.s.sol --broadcast");
        console.log("===========================================");

        vm.stopBroadcast();
    }
}
