'use client'

import { motion } from 'framer-motion'
import { Creature, getRarityName, getElementName, getSpeciesName, getAbilityName, RARITY_COLORS, RARITY_GRADIENTS, ELEMENT_COLORS, ELEMENT_EMOJIS } from '@/lib/traits'

interface CreatureCardProps {
  creature: Creature
  tokenId: number
  isNew?: boolean
}

export function CreatureCard({ creature, tokenId, isNew = false }: CreatureCardProps) {
  const rarityColor = RARITY_COLORS[creature.rarity]
  const rarityGradient = RARITY_GRADIENTS[creature.rarity]
  const elementColor = ELEMENT_COLORS[creature.element]
  const elementEmoji = ELEMENT_EMOJIS[creature.element]
  
  return (
    <motion.div
      initial={isNew ? { scale: 0, rotate: -180, opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
      transition={isNew ? { 
        type: 'spring', 
        stiffness: 200, 
        damping: 15,
        duration: 0.8 
      } : {
        duration: 0.3
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity bg-gradient-to-br ${rarityGradient}`}
      />
      
      {/* Card */}
      <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
        {/* Header with rarity */}
        <div 
          className={`h-2 bg-gradient-to-r ${rarityGradient}`}
        />
        
        <div className="p-5">
          {/* Species and Element */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{elementEmoji}</span>
              <h3 className="text-xl font-bold text-white">
                {getSpeciesName(creature.species)}
              </h3>
            </div>
            <span 
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ 
                background: `${rarityColor}20`,
                color: rarityColor,
                border: `1px solid ${rarityColor}40`
              }}
            >
              {getRarityName(creature.rarity)}
            </span>
          </div>
          
          {/* Creature visual placeholder */}
          <div 
            className="relative h-40 rounded-xl mb-4 flex items-center justify-center overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${elementColor}20, ${rarityColor}20)`
            }}
          >
            <div className="text-7xl opacity-80">
              {getCreatureEmoji(creature.species)}
            </div>
            
            {/* Sparkles for rare+ creatures */}
            {creature.rarity >= 2 && (
              <div className="absolute inset-0">
                {[...Array(creature.rarity * 2)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="space-y-3">
            {/* Element */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Element</span>
              <span 
                className="font-semibold flex items-center gap-1"
                style={{ color: elementColor }}
              >
                {elementEmoji} {getElementName(creature.element)}
              </span>
            </div>
            
            {/* Power */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Power</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${rarityGradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${creature.power}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
                <span className="text-white font-bold w-8 text-right">{creature.power}</span>
              </div>
            </div>
            
            {/* Ability */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Ability</span>
              <span className="text-purple-400 font-semibold text-right">
                {getAbilityName(creature.ability)}
              </span>
            </div>
          </div>
          
          {/* Token ID */}
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <span className="text-gray-500 text-xs">
              Token #{tokenId}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function getCreatureEmoji(species: number): string {
  const emojis: Record<number, string> = {
    0: '🐉', // Dragon
    1: '🦅', // Phoenix (using eagle as proxy)
    2: '🦄', // Unicorn
    3: '🦁', // Griffin (using lion as proxy)
    4: '🐍', // Serpent
    5: '🗿', // Golem
    6: '👻', // Spirit
    7: '🦑', // Kraken
    8: '🐲', // Basilisk (using dragon face)
    9: '🦎', // Chimera (using lizard)
    10: '🐍', // Hydra
    11: '🐴', // Pegasus
    12: '🐉', // Wyrm
    13: '🧞', // Djinn
    14: '🐋', // Leviathan
    15: '🦁', // Sphinx
    16: '🐕', // Cerberus
    17: '🦅', // Thunderbird
    18: '🦣', // Behemoth
    19: '🧚', // Nymph
  }
  return emojis[species] || '❓'
}

