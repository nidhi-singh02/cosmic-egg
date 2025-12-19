export const COSMIC_HATCHERY_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000' as `0x${string}`

export const COSMIC_HATCHERY_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_entropy', type: 'address' },
      { internalType: 'address', name: '_entropyProvider', type: 'address' },
      { internalType: 'uint256', name: '_hatchPrice', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'required', type: 'uint256' },
      { internalType: 'uint256', name: 'provided', type: 'uint256' },
    ],
    name: 'InsufficientPayment',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'rarity', type: 'uint8' },
      { indexed: false, internalType: 'uint8', name: 'element', type: 'uint8' },
      { indexed: false, internalType: 'uint8', name: 'species', type: 'uint8' },
      { indexed: false, internalType: 'uint16', name: 'power', type: 'uint16' },
      { indexed: false, internalType: 'uint8', name: 'ability', type: 'uint8' },
    ],
    name: 'CreatureHatched',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
      { indexed: false, internalType: 'uint64', name: 'sequenceNumber', type: 'uint64' },
    ],
    name: 'EggPurchased',
    type: 'event',
  },
  {
    inputs: [],
    name: 'hatchEgg',
    outputs: [{ internalType: 'uint64', name: 'sequenceNumber', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getHatchCost',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'hatchPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getCreature',
    outputs: [
      {
        components: [
          { internalType: 'uint8', name: 'rarity', type: 'uint8' },
          { internalType: 'uint8', name: 'element', type: 'uint8' },
          { internalType: 'uint8', name: 'species', type: 'uint8' },
          { internalType: 'uint16', name: 'power', type: 'uint16' },
          { internalType: 'uint8', name: 'ability', type: 'uint8' },
          { internalType: 'uint64', name: 'birthBlock', type: 'uint64' },
        ],
        internalType: 'struct CosmicHatchery.Creature',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'getCreaturesByOwner',
    outputs: [
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
      {
        components: [
          { internalType: 'uint8', name: 'rarity', type: 'uint8' },
          { internalType: 'uint8', name: 'element', type: 'uint8' },
          { internalType: 'uint8', name: 'species', type: 'uint8' },
          { internalType: 'uint16', name: 'power', type: 'uint16' },
          { internalType: 'uint8', name: 'ability', type: 'uint8' },
          { internalType: 'uint64', name: 'birthBlock', type: 'uint64' },
        ],
        internalType: 'struct CosmicHatchery.Creature[]',
        name: 'creatureData',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'rarity', type: 'uint8' }],
    name: 'getRarityName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'element', type: 'uint8' }],
    name: 'getElementName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'species', type: 'uint8' }],
    name: 'getSpeciesName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'ability', type: 'uint8' }],
    name: 'getAbilityName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    name: 'totalByRarity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

