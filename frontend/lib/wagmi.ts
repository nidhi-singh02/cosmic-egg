import { http, createConfig } from 'wagmi'
import { type Chain } from 'viem'
import { injected } from 'wagmi/connectors'

// Monad Testnet chain configuration
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
} as const satisfies Chain

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected(), // MetaMask, Rabby, etc.
  ],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

