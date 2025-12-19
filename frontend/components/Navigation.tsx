'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'

export function Navigation() {
  const pathname = usePathname()
  
  const links = [
    { href: '/', label: 'Hatch' },
    { href: '/collection', label: 'Collection' },
  ]
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.span 
                className="text-3xl"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                🥚
              </motion.span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Cosmic Hatchery
              </span>
            </Link>
            
            {/* Nav links */}
            <div className="hidden sm:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-purple-500/20 rounded-lg"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </div>
            
            {/* Connect button */}
            <ConnectButton 
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

