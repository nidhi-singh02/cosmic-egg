// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {CosmicHatchery} from "../src/CosmicHatchery.sol";

contract DeployScript is Script {
    // Hatch price: 0.001 MON
    uint256 constant HATCH_PRICE = 0.001 ether;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address DEFAULT_PROVIDER = 0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344;
        // Read entropy addresses from environment (allows multi-chain deployment)
        address entropyContract = vm.envAddress("ENTROPY_CONTRACT");
        
        vm.startBroadcast(deployerPrivateKey);

        CosmicHatchery hatchery = new CosmicHatchery(
            entropyContract,
            DEFAULT_PROVIDER,
            HATCH_PRICE
        );

        console.log("CosmicHatchery deployed to:", address(hatchery));
        console.log("Entropy contract:", entropyContract);
        console.log("Hatch price:", HATCH_PRICE);

        vm.stopBroadcast();
    }
}

