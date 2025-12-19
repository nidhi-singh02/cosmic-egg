'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Creature, getRarityName, RARITY_COLORS, RARITY_GRADIENTS } from '@/lib/traits'
import { CreatureCard } from './CreatureCard'

interface HatchRevealProps {
  creature: Creature | null
  tokenId: number
  isRevealing: boolean
  onClose: () => void
}

export function HatchReveal({ creature, tokenId, isRevealing, onClose }: HatchRevealProps) {
  if (!creature) return null
  
  const rarityColor = RARITY_COLORS[creature.rarity]
  const rarityGradient = RARITY_GRADIENTS[creature.rarity]
  
  return (
    <AnimatePresence>
      {isRevealing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Burst effect */}
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className={`w-96 h-96 rounded-full bg-gradient-to-r ${rarityGradient} blur-3xl`}
            />
          </motion.div>
          
          {/* Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: rarityColor,
                boxShadow: `0 0 10px ${rarityColor}`,
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1,
                scale: 0 
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600,
                opacity: [1, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{ 
                duration: 1.2,
                delay: 0.1 + i * 0.02,
                ease: 'easeOut'
              }}
            />
          ))}
          
          {/* Stars burst */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute text-4xl"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1,
                scale: 0,
                rotate: 0
              }}
              animate={{ 
                x: Math.cos((i / 8) * Math.PI * 2) * 200,
                y: Math.sin((i / 8) * Math.PI * 2) * 200,
                opacity: [1, 1, 0],
                scale: [0, 1.5, 0],
                rotate: 360,
              }}
              transition={{ 
                duration: 1,
                delay: 0.2 + i * 0.05,
              }}
            >
              ✨
            </motion.div>
          ))}
          
          {/* Card reveal */}
          <motion.div
            initial={{ scale: 0, y: 100, rotateY: 180 }}
            animate={{ 
              scale: 1, 
              y: 0, 
              rotateY: 0,
            }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.3
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10"
          >
            <CreatureCard 
              creature={creature} 
              tokenId={tokenId}
              isNew={true}
            />
            
            {/* Congratulations text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <h2 className={`text-2xl font-bold bg-gradient-to-r ${rarityGradient} bg-clip-text text-transparent`}>
                {creature.rarity >= 4 ? '🎉 INCREDIBLE! 🎉' : 
                 creature.rarity >= 2 ? '✨ Amazing! ✨' : 
                 'Congratulations!'}
              </h2>
              <p className="text-gray-400 mt-2">
                You hatched a{creature.rarity >= 3 ? 'n' : ''} {getRarityName(creature.rarity)} creature!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors"
              >
                Awesome!
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

