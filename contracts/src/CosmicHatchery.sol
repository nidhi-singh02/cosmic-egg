// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyV2.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

/**
 * @title CosmicHatchery
 * @dev On-chain game where players hatch cosmic eggs containing creatures with random traits
 * @notice Uses Pyth Entropy v2 for verifiable randomness
 */
contract CosmicHatchery is ERC721Enumerable, Ownable, ReentrancyGuard, IEntropyConsumer {
    // ============ Constants ============
    
    // Rarity thresholds (out of 1000)
    uint16 constant COMMON_THRESHOLD = 500;      // 50%
    uint16 constant UNCOMMON_THRESHOLD = 750;    // 25%
    uint16 constant RARE_THRESHOLD = 900;        // 15%
    uint16 constant EPIC_THRESHOLD = 970;        // 7%
    uint16 constant LEGENDARY_THRESHOLD = 995;   // 2.5%
    // Mythic = remaining 0.5%
    
    uint8 constant NUM_ELEMENTS = 8;
    uint8 constant NUM_SPECIES = 20;
    uint8 constant NUM_ABILITIES = 30;
    
    // ============ Structs ============
    
    struct Creature {
        uint8 rarity;      // 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary, 5=Mythic
        uint8 element;     // 0-7 (Fire, Water, Earth, Air, Lightning, Shadow, Light, Void)
        uint8 species;     // 0-19 (various creature types)
        uint16 power;      // 1-100 scaled by rarity
        uint8 ability;     // 0-29 (special abilities)
        uint64 birthBlock; // Block when hatched
    }
    
    struct PendingHatch {
        address requester;
        uint64 sequenceNumber;
        uint256 timestamp;
    }
    
    // ============ State Variables ============
    
    IEntropyV2 public immutable entropy;
    address public immutable entropyProvider;
    
    uint256 public hatchPrice;
    uint256 public nextTokenId;
    
    // Token ID => Creature data
    mapping(uint256 => Creature) public creatures;
    
    // Sequence number => Pending hatch data
    mapping(uint64 => PendingHatch) public pendingHatches;
    
    // User => Array of their token IDs (for easy lookup)
    mapping(address => uint256[]) private _userTokens;
    
    // Total creatures hatched by rarity
    mapping(uint8 => uint256) public totalByRarity;
    
    // ============ Events ============
    
    event EggPurchased(address indexed buyer, uint64 sequenceNumber);
    event CreatureHatched(
        address indexed owner,
        uint256 indexed tokenId,
        uint8 rarity,
        uint8 element,
        uint8 species,
        uint16 power,
        uint8 ability
    );
    event HatchPriceUpdated(uint256 oldPrice, uint256 newPrice);
    
    // ============ Errors ============
    
    error InsufficientPayment(uint256 required, uint256 provided);
    error HatchNotPending(uint64 sequenceNumber);
    error NotAuthorized();
    
    // ============ Constructor ============
    
    constructor(
        address _entropy,
        address _entropyProvider,
        uint256 _hatchPrice
    ) ERC721("Cosmic Creature", "COSMIC") Ownable(msg.sender) {
        entropy = IEntropyV2(_entropy);
        entropyProvider = _entropyProvider;
        hatchPrice = _hatchPrice;
        nextTokenId = 1;
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Purchase and hatch an egg
     * @dev Requests randomness from Pyth Entropy
     */
    function hatchEgg() external payable nonReentrant returns (uint64 sequenceNumber) {
        // Get the entropy fee
        uint128 entropyFee = entropy.getFeeV2();
        uint256 totalRequired = hatchPrice + entropyFee;
        
        if (msg.value < totalRequired) {
            revert InsufficientPayment(totalRequired, msg.value);
        }
        
        // Request randomness from Pyth Entropy V2
        sequenceNumber = entropy.requestV2{value: entropyFee}();
        
        // Store pending hatch
        pendingHatches[sequenceNumber] = PendingHatch({
            requester: msg.sender,
            sequenceNumber: sequenceNumber,
            timestamp: block.timestamp
        });
        
        emit EggPurchased(msg.sender, sequenceNumber);
        
        // Refund excess payment
        uint256 excess = msg.value - totalRequired;
        if (excess > 0) {
            (bool success, ) = msg.sender.call{value: excess}("");
            require(success, "Refund failed");
        }
        
        return sequenceNumber;
    }
    
    /**
     * @notice Get the total cost to hatch an egg (hatch price + entropy fee)
     * @return Total cost in wei
     */
    function getHatchCost() external view returns (uint256) {
        return hatchPrice + entropy.getFeeV2();
    }
    
    /**
     * @notice Get creature data for a token
     * @param tokenId The token ID to query
     * @return The creature data
     */
    function getCreature(uint256 tokenId) external view returns (Creature memory) {
        require(tokenId > 0 && tokenId < nextTokenId, "Token does not exist");
        return creatures[tokenId];
    }
    
    /**
     * @notice Get all creatures owned by an address
     * @param owner The address to query
     * @return tokenIds Array of token IDs
     * @return creatureData Array of creature data
     */
    function getCreaturesByOwner(address owner) 
        external 
        view 
        returns (uint256[] memory tokenIds, Creature[] memory creatureData) 
    {
        uint256 balance = balanceOf(owner);
        tokenIds = new uint256[](balance);
        creatureData = new Creature[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, i);
            tokenIds[i] = tokenId;
            creatureData[i] = creatures[tokenId];
        }
        
        return (tokenIds, creatureData);
    }
    
    /**
     * @notice Get rarity name from rarity index
     * @param rarity The rarity index (0-5)
     * @return The rarity name
     */
    function getRarityName(uint8 rarity) external pure returns (string memory) {
        if (rarity == 0) return "Common";
        if (rarity == 1) return "Uncommon";
        if (rarity == 2) return "Rare";
        if (rarity == 3) return "Epic";
        if (rarity == 4) return "Legendary";
        if (rarity == 5) return "Mythic";
        return "Unknown";
    }
    
    /**
     * @notice Get element name from element index
     * @param element The element index (0-7)
     * @return The element name
     */
    function getElementName(uint8 element) external pure returns (string memory) {
        if (element == 0) return "Fire";
        if (element == 1) return "Water";
        if (element == 2) return "Earth";
        if (element == 3) return "Air";
        if (element == 4) return "Lightning";
        if (element == 5) return "Shadow";
        if (element == 6) return "Light";
        if (element == 7) return "Void";
        return "Unknown";
    }
    
    /**
     * @notice Get species name from species index
     * @param species The species index (0-19)
     * @return The species name
     */
    function getSpeciesName(uint8 species) external pure returns (string memory) {
        string[20] memory speciesNames = [
            "Dragon", "Phoenix", "Unicorn", "Griffin", "Serpent",
            "Golem", "Spirit", "Kraken", "Basilisk", "Chimera",
            "Hydra", "Pegasus", "Wyrm", "Djinn", "Leviathan",
            "Sphinx", "Cerberus", "Thunderbird", "Behemoth", "Nymph"
        ];
        if (species < 20) return speciesNames[species];
        return "Unknown";
    }
    
    /**
     * @notice Get ability name from ability index
     * @param ability The ability index (0-29)
     * @return The ability name
     */
    function getAbilityName(uint8 ability) external pure returns (string memory) {
        string[30] memory abilityNames = [
            "Inferno Burst", "Tidal Wave", "Earthquake", "Cyclone", "Thunder Strike",
            "Shadow Step", "Divine Shield", "Void Rift", "Regeneration", "Berserk",
            "Time Warp", "Teleport", "Mind Control", "Paralyze", "Poison Cloud",
            "Ice Storm", "Solar Flare", "Lunar Blessing", "Drain Life", "Stone Skin",
            "Invisibility", "Flight", "Super Speed", "Iron Will", "Nature's Wrath",
            "Soul Siphon", "Astral Projection", "Quantum Shift", "Primal Roar", "Cosmic Ray"
        ];
        if (ability < 30) return abilityNames[ability];
        return "Unknown";
    }
    
    // ============ Owner Functions ============
    
    /**
     * @notice Update the hatch price
     * @param newPrice The new hatch price in wei
     */
    function setHatchPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = hatchPrice;
        hatchPrice = newPrice;
        emit HatchPriceUpdated(oldPrice, newPrice);
    }
    
    /**
     * @notice Withdraw accumulated fees
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // ============ Internal Functions ============
    
    /**
     * @notice Returns the Entropy contract address (required by IEntropyConsumer)
     */
    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }
    
    /**
     * @notice Callback function called by Entropy with the random number
     * @param sequenceNumber The sequence number of the request
     * @param provider The provider address
     * @param randomNumber The generated random number
     */
    function entropyCallback(
        uint64 sequenceNumber,
        address provider,
        bytes32 randomNumber
    ) internal override {
        provider; // Silence unused variable warning
        
        PendingHatch memory pending = pendingHatches[sequenceNumber];
        if (pending.requester == address(0)) {
            revert HatchNotPending(sequenceNumber);
        }
        
        // Delete pending hatch
        delete pendingHatches[sequenceNumber];
        
        // Generate creature from random number
        Creature memory creature = _generateCreature(randomNumber);
        
        // Mint NFT
        uint256 tokenId = nextTokenId++;
        _safeMint(pending.requester, tokenId);
        
        // Store creature data
        creatures[tokenId] = creature;
        totalByRarity[creature.rarity]++;
        
        emit CreatureHatched(
            pending.requester,
            tokenId,
            creature.rarity,
            creature.element,
            creature.species,
            creature.power,
            creature.ability
        );
    }
    
    /**
     * @notice Generate creature traits from random number
     * @param randomNumber The random number from Entropy
     * @return creature The generated creature
     */
    function _generateCreature(bytes32 randomNumber) internal view returns (Creature memory creature) {
        // Split the random number into different segments for each trait
        uint256 rand = uint256(randomNumber);
        
        // Determine rarity (use first 10 bits, mod 1000)
        uint16 rarityRoll = uint16(rand % 1000);
        rand = rand >> 10;
        
        uint8 rarity;
        if (rarityRoll < COMMON_THRESHOLD) {
            rarity = 0; // Common
        } else if (rarityRoll < UNCOMMON_THRESHOLD) {
            rarity = 1; // Uncommon
        } else if (rarityRoll < RARE_THRESHOLD) {
            rarity = 2; // Rare
        } else if (rarityRoll < EPIC_THRESHOLD) {
            rarity = 3; // Epic
        } else if (rarityRoll < LEGENDARY_THRESHOLD) {
            rarity = 4; // Legendary
        } else {
            rarity = 5; // Mythic
        }
        
        // Determine element (8 elements, equal probability)
        uint8 element = uint8(rand % NUM_ELEMENTS);
        rand = rand >> 8;
        
        // Determine species (20 species, equal probability)
        uint8 species = uint8(rand % NUM_SPECIES);
        rand = rand >> 8;
        
        // Determine power (base 1-50, scaled by rarity)
        uint16 basePower = uint16((rand % 50) + 1);
        rand = rand >> 8;
        
        // Scale power by rarity: Common +0, Uncommon +10, Rare +20, Epic +30, Legendary +40, Mythic +50
        uint16 power = basePower + (uint16(rarity) * 10);
        
        // Determine ability (30 abilities, equal probability)
        uint8 ability = uint8(rand % NUM_ABILITIES);
        
        creature = Creature({
            rarity: rarity,
            element: element,
            species: species,
            power: power,
            ability: ability,
            birthBlock: uint64(block.number)
        });
        
        return creature;
    }
    
    // ============ Receive Function ============
    
    receive() external payable {}
}

