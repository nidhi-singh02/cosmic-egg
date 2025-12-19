// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {CosmicHatchery} from "../src/CosmicHatchery.sol";
import "@pythnetwork/entropy-sdk-solidity/MockEntropy.sol";

contract CosmicHatcheryTest is Test {
    CosmicHatchery public hatchery;
    MockEntropy public mockEntropy;
    
    address public user = address(0x1);
    address public owner = address(0x2);
    address public mockProvider = address(0x123);
    
    uint256 constant HATCH_PRICE = 0.001 ether;
    uint128 constant MOCK_FEE = 0.0001 ether;

    function setUp() public {
        // Deploy mock entropy with a default provider
        mockEntropy = new MockEntropy(mockProvider);
        
        // Deploy hatchery with mock entropy
        vm.prank(owner);
        hatchery = new CosmicHatchery(
            address(mockEntropy),
            mockProvider,
            HATCH_PRICE
        );
        
        // Fund user
        vm.deal(user, 10 ether);
    }

    function test_HatchEgg() public {
        uint256 totalCost = hatchery.getHatchCost();
        
        vm.prank(user);
        uint64 sequenceNumber = hatchery.hatchEgg{value: totalCost}();
        
        assertGt(sequenceNumber, 0, "Sequence number should be greater than 0");
    }

    function test_HatchEgg_InsufficientPayment() public {
        vm.prank(user);
        vm.expectRevert();
        hatchery.hatchEgg{value: 0.0001 ether}();
    }

    function test_GetHatchCost() public view {
        uint256 cost = hatchery.getHatchCost();
        // MockEntropy returns 0 fee, so cost equals hatch price
        assertGe(cost, HATCH_PRICE, "Cost should be at least hatch price");
    }

    function test_GetRarityName() public view {
        assertEq(hatchery.getRarityName(0), "Common");
        assertEq(hatchery.getRarityName(1), "Uncommon");
        assertEq(hatchery.getRarityName(2), "Rare");
        assertEq(hatchery.getRarityName(3), "Epic");
        assertEq(hatchery.getRarityName(4), "Legendary");
        assertEq(hatchery.getRarityName(5), "Mythic");
        assertEq(hatchery.getRarityName(6), "Unknown");
    }

    function test_GetElementName() public view {
        assertEq(hatchery.getElementName(0), "Fire");
        assertEq(hatchery.getElementName(1), "Water");
        assertEq(hatchery.getElementName(2), "Earth");
        assertEq(hatchery.getElementName(3), "Air");
        assertEq(hatchery.getElementName(4), "Lightning");
        assertEq(hatchery.getElementName(5), "Shadow");
        assertEq(hatchery.getElementName(6), "Light");
        assertEq(hatchery.getElementName(7), "Void");
        assertEq(hatchery.getElementName(8), "Unknown");
    }

    function test_GetSpeciesName() public view {
        assertEq(hatchery.getSpeciesName(0), "Dragon");
        assertEq(hatchery.getSpeciesName(19), "Nymph");
        assertEq(hatchery.getSpeciesName(20), "Unknown");
    }

    function test_GetAbilityName() public view {
        assertEq(hatchery.getAbilityName(0), "Inferno Burst");
        assertEq(hatchery.getAbilityName(29), "Cosmic Ray");
        assertEq(hatchery.getAbilityName(30), "Unknown");
    }

    function test_SetHatchPrice() public {
        uint256 newPrice = 0.002 ether;
        
        vm.prank(owner);
        hatchery.setHatchPrice(newPrice);
        
        assertEq(hatchery.hatchPrice(), newPrice);
    }

    function test_SetHatchPrice_NotOwner() public {
        vm.prank(user);
        vm.expectRevert();
        hatchery.setHatchPrice(0.002 ether);
    }

    function test_Withdraw() public {
        // First hatch an egg to add funds
        uint256 totalCost = hatchery.getHatchCost();
        vm.prank(user);
        hatchery.hatchEgg{value: totalCost}();
        
        uint256 balance = address(hatchery).balance;
        uint256 ownerBalanceBefore = owner.balance;
        
        vm.prank(owner);
        hatchery.withdraw();
        
        assertEq(owner.balance, ownerBalanceBefore + balance);
    }

    function test_Withdraw_NotOwner() public {
        vm.prank(user);
        vm.expectRevert();
        hatchery.withdraw();
    }

    // Test full hatch flow with callback
    function test_FullHatchFlow() public {
        uint256 totalCost = hatchery.getHatchCost();
        
        // Request hatch
        vm.prank(user);
        uint64 sequenceNumber = hatchery.hatchEgg{value: totalCost}();
        
        // Check no creatures yet
        assertEq(hatchery.balanceOf(user), 0);
        
        // Simulate entropy callback
        bytes32 randomNumber = keccak256(abi.encodePacked("test random"));
        mockEntropy.mockReveal(mockProvider, sequenceNumber, randomNumber);
        
        // Check creature was minted
        assertEq(hatchery.balanceOf(user), 1);
        
        // Check creature data exists
        CosmicHatchery.Creature memory creature = hatchery.getCreature(1);
        assertTrue(creature.birthBlock > 0, "Creature should have birth block");
        assertTrue(creature.rarity <= 5, "Rarity should be 0-5");
        assertTrue(creature.element < 8, "Element should be 0-7");
        assertTrue(creature.species < 20, "Species should be 0-19");
        assertTrue(creature.ability < 30, "Ability should be 0-29");
        assertTrue(creature.power > 0 && creature.power <= 100, "Power should be 1-100");
    }

    // Test multiple hatches
    function test_MultipleHatches() public {
        uint256 totalCost = hatchery.getHatchCost();
        
        // Hatch 3 eggs
        for (uint256 i = 0; i < 3; i++) {
            vm.prank(user);
            uint64 sequenceNumber = hatchery.hatchEgg{value: totalCost}();
            
            bytes32 randomNumber = keccak256(abi.encodePacked("random", i));
            mockEntropy.mockReveal(mockProvider, sequenceNumber, randomNumber);
        }
        
        // Check user has 3 creatures
        assertEq(hatchery.balanceOf(user), 3);
        
        // Check getCreaturesByOwner returns correct data
        (uint256[] memory tokenIds, CosmicHatchery.Creature[] memory creatures) = hatchery.getCreaturesByOwner(user);
        assertEq(tokenIds.length, 3);
        assertEq(creatures.length, 3);
    }

    // Fuzz test for creature generation with various random inputs
    function testFuzz_CreatureGeneration(bytes32 randomNumber) public {
        uint256 totalCost = hatchery.getHatchCost();
        
        vm.prank(user);
        uint64 sequenceNumber = hatchery.hatchEgg{value: totalCost}();
        
        mockEntropy.mockReveal(mockProvider, sequenceNumber, randomNumber);
        
        CosmicHatchery.Creature memory creature = hatchery.getCreature(1);
        
        // Verify all traits are within valid ranges
        assertTrue(creature.rarity <= 5, "Rarity out of range");
        assertTrue(creature.element < 8, "Element out of range");
        assertTrue(creature.species < 20, "Species out of range");
        assertTrue(creature.ability < 30, "Ability out of range");
        assertTrue(creature.power >= 1 && creature.power <= 100, "Power out of range");
    }
}

