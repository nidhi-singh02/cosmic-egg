'use client'

import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { CreatureCard } from '@/components/CreatureCard'
import { useCreaturesByOwner } from '@/hooks/useHatchery'
import { Creature } from '@/lib/traits'
import Link from 'next/link'

export default function CollectionPage() {
  const { address, isConnected } = useAccount()
  const { data, isLoading, error } = useCreaturesByOwner(address)

  const tokenIds = data?.[0] || []
  const creatures = data?.[1] || []

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
              Your Collection
            </span>
          </h1>
          <p className="text-gray-400">
            {isConnected 
              ? `You own ${tokenIds.length} cosmic creature${tokenIds.length !== 1 ? 's' : ''}`
              : 'Connect your wallet to view your collection'
            }
          </p>
        </motion.div>

        {/* Not connected state */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">🔗</span>
            <p className="text-gray-400 text-lg mb-4">Connect your wallet to see your creatures</p>
          </motion.div>
        )}

        {/* Loading state */}
        {isConnected && isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">⚠️</span>
            <p className="text-red-400">Error loading collection</p>
          </motion.div>
        )}

        {/* Empty state */}
        {isConnected && !isLoading && tokenIds.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">🥚</span>
            <p className="text-gray-400 text-lg mb-4">You haven&apos;t hatched any creatures yet</p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors"
            >
              Hatch Your First Egg
            </Link>
          </motion.div>
        )}

        {/* Creature grid */}
        {isConnected && !isLoading && tokenIds.length > 0 && (
          <>
            {/* Filter/Sort options */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-500">
                Showing {tokenIds.length} creature{tokenIds.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {tokenIds.map((tokenId, index) => {
                const creature = creatures[index]
                if (!creature) return null
                
                const formattedCreature: Creature = {
                  rarity: creature.rarity,
                  element: creature.element,
                  species: creature.species,
                  power: creature.power,
                  ability: creature.ability,
                  birthBlock: creature.birthBlock,
                }
                
                return (
                  <motion.div
                    key={tokenId.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CreatureCard
                      creature={formattedCreature}
                      tokenId={Number(tokenId)}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </>
        )}

        {/* Stats summary */}
        {isConnected && !isLoading && tokenIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl"
          >
            <h2 className="text-xl font-bold mb-4">Collection Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem
                label="Total Creatures"
                value={tokenIds.length.toString()}
              />
              <StatItem
                label="Rarest"
                value={getRarestCreature(creatures as unknown as Creature[])}
              />
              <StatItem
                label="Highest Power"
                value={getHighestPower(creatures as unknown as Creature[]).toString()}
              />
              <StatItem
                label="Unique Elements"
                value={getUniqueElements(creatures as unknown as Creature[]).toString()}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
      <p className="text-2xl font-bold text-purple-400">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  )
}

function getRarestCreature(creatures: Creature[]): string {
  const rarityNames = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']
  const maxRarity = Math.max(...creatures.map(c => c.rarity))
  return rarityNames[maxRarity] || 'None'
}

function getHighestPower(creatures: Creature[]): number {
  return Math.max(...creatures.map(c => c.power), 0)
}

function getUniqueElements(creatures: Creature[]): number {
  return new Set(creatures.map(c => c.element)).size
}

