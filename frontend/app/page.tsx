'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { motion } from 'framer-motion'
import { CosmicEgg } from '@/components/CosmicEgg'
import { HatchReveal } from '@/components/HatchReveal'
import { useHatchCost, useHatchEgg, useUserBalance, useCreaturesByOwner } from '@/hooks/useHatchery'
import { Creature } from '@/lib/traits'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { data: hatchCost, refetch: refetchCost } = useHatchCost()
  const { data: balance, refetch: refetchBalance } = useUserBalance()
  const { data: creaturesData, refetch: refetchCreatures } = useCreaturesByOwner(address)
  const { hatch, isPending, isConfirming, isSuccess, hash, error, reset, parseCreatureFromReceipt } = useHatchEgg()
  
  const [isHatching, setIsHatching] = useState(false)
  const [revealedCreature, setRevealedCreature] = useState<Creature | null>(null)
  const [revealedTokenId, setRevealedTokenId] = useState<number>(0)
  const [showReveal, setShowReveal] = useState(false)
  const previousBalanceRef = useRef<bigint | undefined>(undefined)
  
  // Track balance changes for fallback detection
  useEffect(() => {
    if (balance !== undefined) {
      previousBalanceRef.current = balance
    }
  }, [balance])

  // Handle successful transaction - parse creature from receipt or poll for new creature
  useEffect(() => {
    if (isSuccess && isHatching) {
      // Try to parse from transaction receipt first
      const result = parseCreatureFromReceipt()
      if (result) {
        setRevealedCreature(result.creature)
        setRevealedTokenId(result.tokenId)
        setIsHatching(false)
        setShowReveal(true)
        refetchBalance()
        return
      }
      
      // Fallback: Poll for the new creature in collection
      const pollForCreature = async () => {
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
          const { data: newData } = await refetchCreatures()
          
          if (newData && newData[0] && newData[0].length > 0) {
            const tokenIds = newData[0] as bigint[]
            const creatures = newData[1] as Creature[]
            
            // Get the latest creature (highest token ID)
            const latestIndex = tokenIds.length - 1
            const latestTokenId = Number(tokenIds[latestIndex])
            const latestCreature = creatures[latestIndex]
            
            if (latestCreature) {
              setRevealedCreature(latestCreature)
              setRevealedTokenId(latestTokenId)
              setIsHatching(false)
              setShowReveal(true)
              refetchBalance()
              return
            }
          }
        }
        // If polling fails after 10 attempts, just reset the UI
        setIsHatching(false)
        refetchBalance()
      }
      
      pollForCreature()
    }
  }, [isSuccess, isHatching, parseCreatureFromReceipt, refetchCreatures, refetchBalance])

  const handleHatch = async () => {
    if (!hatchCost) return
    reset() // Reset previous transaction state
    setIsHatching(true)
    try {
      await hatch(hatchCost)
    } catch (e) {
      setIsHatching(false)
    }
  }

  const closeReveal = () => {
    setShowReveal(false)
    setRevealedCreature(null)
  }

  // Reset hatching state on error
  useEffect(() => {
    if (error) {
      setIsHatching(false)
    }
  }, [error])

  const formattedCost = hatchCost ? formatEther(hatchCost) : '...'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
              Cosmic Egg
            </span>
            <br />
            <span className="text-white">Hatchery</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Hatch mysterious cosmic eggs and discover unique creatures with 
            <span className="text-purple-400 font-semibold"> verifiable on-chain randomness</span>
          </p>
        </motion.div>

        {/* Egg */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CosmicEgg
            isHatching={isHatching || isPending || isConfirming}
            onHatch={handleHatch}
            disabled={!isConnected || !hatchCost}
            cost={formattedCost}
          />
        </motion.div>

        {/* Status messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          {!isConnected && (
            <p className="text-gray-500">Connect your wallet to start hatching</p>
          )}
          {isPending && (
            <p className="text-yellow-400">Confirm transaction in your wallet...</p>
          )}
          {isConfirming && (
            <p className="text-blue-400">Waiting for confirmation...</p>
          )}
          {error && (
            <p className="text-red-400">Error: {(error as Error).message?.slice(0, 50)}...</p>
          )}
        </motion.div>

        {/* Stats */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex gap-8"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">
                {balance?.toString() || '0'}
              </p>
              <p className="text-gray-500 text-sm">Creatures Owned</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Features */}
      <div className="border-t border-gray-800/50 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              emoji="🎲"
              title="Pyth Entropy"
              description="True randomness powered by Pyth's verifiable random function"
            />
            <FeatureCard
              emoji="✨"
              title="6 Rarity Tiers"
              description="From Common to Mythic - chase the rarest creatures"
            />
            <FeatureCard
              emoji="🎮"
              title="8 Elements"
              description="Fire, Water, Earth, Air, Lightning, Shadow, Light, and Void"
            />
          </div>
        </div>
      </div>

      {/* Reveal modal */}
      <HatchReveal
        creature={revealedCreature}
        tokenId={revealedTokenId}
        isRevealing={showReveal}
        onClose={closeReveal}
      />
    </div>
  )
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center"
    >
      <span className="text-4xl mb-4 block">{emoji}</span>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  )
}
