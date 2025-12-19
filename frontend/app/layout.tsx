import type { Metadata } from 'next'
import { Space_Grotesk, Orbitron } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navigation } from '@/components/Navigation'
import { StarField } from '@/components/StarField'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Cosmic Egg Hatchery | On-Chain Creature Collection',
  description: 'Hatch cosmic eggs and collect unique creatures with verifiable on-chain randomness powered by Pyth Entropy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${orbitron.variable} font-sans antialiased bg-gray-950 text-white min-h-screen`}>
        <Providers>
          <StarField />
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
