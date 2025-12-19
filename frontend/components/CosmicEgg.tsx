'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface CosmicEggProps {
  isHatching: boolean
  onHatch: () => void
  disabled?: boolean
  cost?: string
}

export function CosmicEgg({ isHatching, onHatch, disabled, cost }: CosmicEggProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect */}
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl"
        animate={{
          background: isHatching 
            ? ['radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
               'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
               'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
               'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)']
            : isHovered
            ? 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
          scale: isHatching ? [1, 1.2, 1] : isHovered ? 1.1 : 1,
        }}
        transition={{
          duration: isHatching ? 0.5 : 0.3,
          repeat: isHatching ? Infinity : 0,
        }}
      />
      
      {/* Egg container */}
      <motion.button
        onClick={onHatch}
        disabled={disabled || isHatching}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative cursor-pointer disabled:cursor-not-allowed"
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        animate={isHatching ? {
          rotate: [-2, 2, -2, 2, 0],
          scale: [1, 1.02, 1, 1.02, 1],
        } : {}}
        transition={isHatching ? {
          duration: 0.3,
          repeat: Infinity,
        } : {}}
      >
        {/* Main egg SVG */}
        <svg
          width="200"
          height="260"
          viewBox="0 0 200 260"
          className="drop-shadow-2xl"
        >
          <defs>
            {/* Gradient for egg shell */}
            <linearGradient id="eggGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="30%" stopColor="#312e81" />
              <stop offset="70%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
            
            {/* Shimmer effect */}
            <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-1 -1; 1 1"
                dur="2s"
                repeatCount="indefinite"
              />
            </linearGradient>
            
            {/* Star pattern */}
            <pattern id="stars" patternUnits="userSpaceOnUse" width="40" height="40">
              <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.5)" />
              <circle cx="30" cy="25" r="0.5" fill="rgba(255,255,255,0.3)" />
              <circle cx="20" cy="35" r="0.8" fill="rgba(255,255,255,0.4)" />
            </pattern>
          </defs>
          
          {/* Egg shape */}
          <ellipse
            cx="100"
            cy="145"
            rx="80"
            ry="105"
            fill="url(#eggGradient)"
            stroke="url(#shimmer)"
            strokeWidth="2"
          />
          
          {/* Star overlay */}
          <ellipse
            cx="100"
            cy="145"
            rx="75"
            ry="100"
            fill="url(#stars)"
            opacity="0.5"
          />
          
          {/* Highlight */}
          <ellipse
            cx="70"
            cy="100"
            rx="25"
            ry="40"
            fill="rgba(255,255,255,0.1)"
          />
          
          {/* Mysterious symbol */}
          <g transform="translate(100, 145)">
            <motion.path
              d="M0,-30 L20,10 L-20,10 Z"
              fill="none"
              stroke="rgba(236,72,153,0.6)"
              strokeWidth="2"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <motion.circle
              cx="0"
              cy="0"
              r="8"
              fill="none"
              stroke="rgba(139,92,246,0.6)"
              strokeWidth="2"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </g>
        </svg>
        
        {/* Floating particles when hatching */}
        <AnimatePresence>
          {isHatching && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#ec4899', '#8b5cf6', '#3b82f6', '#22c55e'][i % 4],
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 120,
                    y: Math.sin((i / 12) * Math.PI * 2) * 120,
                    opacity: [1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  exit={{ opacity: 0 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>
      
      {/* Hatch button text */}
      <motion.div
        className="mt-8 text-center"
        animate={{ opacity: disabled ? 0.5 : 1 }}
      >
        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          {isHatching ? 'Hatching...' : 'Click to Hatch'}
        </p>
        {cost && (
          <p className="mt-2 text-gray-400">
            Cost: <span className="text-purple-400 font-semibold">{cost} MON</span>
          </p>
        )}
      </motion.div>
    </div>
  )
}

