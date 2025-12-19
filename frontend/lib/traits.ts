export const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'] as const
export type Rarity = (typeof RARITIES)[number]

export const RARITY_COLORS: Record<number, string> = {
  0: '#9CA3AF', // Common - Gray
  1: '#22C55E', // Uncommon - Green
  2: '#3B82F6', // Rare - Blue
  3: '#A855F7', // Epic - Purple
  4: '#F59E0B', // Legendary - Orange
  5: '#EC4899', // Mythic - Pink
}

export const RARITY_GRADIENTS: Record<number, string> = {
  0: 'from-gray-400 to-gray-600',
  1: 'from-green-400 to-green-600',
  2: 'from-blue-400 to-blue-600',
  3: 'from-purple-400 to-purple-600',
  4: 'from-amber-400 to-orange-600',
  5: 'from-pink-400 via-purple-500 to-indigo-600',
}

export const ELEMENTS = ['Fire', 'Water', 'Earth', 'Air', 'Lightning', 'Shadow', 'Light', 'Void'] as const
export type Element = (typeof ELEMENTS)[number]

export const ELEMENT_COLORS: Record<number, string> = {
  0: '#EF4444', // Fire - Red
  1: '#3B82F6', // Water - Blue
  2: '#84CC16', // Earth - Green
  3: '#06B6D4', // Air - Cyan
  4: '#FACC15', // Lightning - Yellow
  5: '#6366F1', // Shadow - Indigo
  6: '#FBBF24', // Light - Amber
  7: '#8B5CF6', // Void - Violet
}

export const ELEMENT_EMOJIS: Record<number, string> = {
  0: '🔥',
  1: '💧',
  2: '🌍',
  3: '💨',
  4: '⚡',
  5: '🌑',
  6: '✨',
  7: '🌀',
}

export const SPECIES = [
  'Dragon', 'Phoenix', 'Unicorn', 'Griffin', 'Serpent',
  'Golem', 'Spirit', 'Kraken', 'Basilisk', 'Chimera',
  'Hydra', 'Pegasus', 'Wyrm', 'Djinn', 'Leviathan',
  'Sphinx', 'Cerberus', 'Thunderbird', 'Behemoth', 'Nymph'
] as const
export type Species = (typeof SPECIES)[number]

export const ABILITIES = [
  'Inferno Burst', 'Tidal Wave', 'Earthquake', 'Cyclone', 'Thunder Strike',
  'Shadow Step', 'Divine Shield', 'Void Rift', 'Regeneration', 'Berserk',
  'Time Warp', 'Teleport', 'Mind Control', 'Paralyze', 'Poison Cloud',
  'Ice Storm', 'Solar Flare', 'Lunar Blessing', 'Drain Life', 'Stone Skin',
  'Invisibility', 'Flight', 'Super Speed', 'Iron Will', "Nature's Wrath",
  'Soul Siphon', 'Astral Projection', 'Quantum Shift', 'Primal Roar', 'Cosmic Ray'
] as const
export type Ability = (typeof ABILITIES)[number]

export interface Creature {
  rarity: number
  element: number
  species: number
  power: number
  ability: number
  birthBlock: bigint
}

export function getRarityName(rarity: number): string {
  return RARITIES[rarity] || 'Unknown'
}

export function getElementName(element: number): string {
  return ELEMENTS[element] || 'Unknown'
}

export function getSpeciesName(species: number): string {
  return SPECIES[species] || 'Unknown'
}

export function getAbilityName(ability: number): string {
  return ABILITIES[ability] || 'Unknown'
}

