// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {CosmicHatchery} from "../src/CosmicHatchery.sol";

contract DeployScript is Script {
    // Pyth Entropy contract addresses
    // Base Sepolia: https://docs.pyth.network/entropy/contract-addresses
    address constant ENTROPY_BASE_SEPOLIA = 0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c;
    
    // Default provider (Pyth's default entropy provider)
    // This can be obtained by calling entropy.getDefaultProvider()
    address constant DEFAULT_PROVIDER = 0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344;
    
    // Hatch price: 0.001 ETH
    uint256 constant HATCH_PRICE = 0.001 ether;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        CosmicHatchery hatchery = new CosmicHatchery(
            ENTROPY_BASE_SEPOLIA,
            DEFAULT_PROVIDER,
            HATCH_PRICE
        );

        console.log("CosmicHatchery deployed to:", address(hatchery));
        console.log("Entropy contract:", ENTROPY_BASE_SEPOLIA);
        console.log("Hatch price:", HATCH_PRICE);

        vm.stopBroadcast();
    }
}

