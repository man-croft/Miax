// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Faucet} from "../src/Faucet.sol";
import {TriviaGame} from "../src/TriviaGame.sol";

contract DeployScript is Script {
    // Base Sepolia USDC token address
    address constant USDC_TOKEN = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Faucet contract
        Faucet faucet = new Faucet(USDC_TOKEN);
        console.log("Faucet deployed to:", address(faucet));

        // Deploy TriviaGame contract
        TriviaGame triviaGame = new TriviaGame(USDC_TOKEN);
        console.log("TriviaGame deployed to:", address(triviaGame));
        
        vm.stopBroadcast();
    }
}
