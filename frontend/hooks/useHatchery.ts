'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, usePublicClient } from 'wagmi'
import { decodeEventLog } from 'viem'
import { COSMIC_HATCHERY_ADDRESS, COSMIC_HATCHERY_ABI } from '@/lib/contract'
import { Creature } from '@/lib/traits'

export function useHatchCost() {
  return useReadContract({
    address: COSMIC_HATCHERY_ADDRESS,
    abi: COSMIC_HATCHERY_ABI,
    functionName: 'getHatchCost',
  })
}

export function useHatchEgg() {
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract()
  const publicClient = usePublicClient()
  
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  })

  const hatch = async (cost: bigint) => {
    writeContract({
      address: COSMIC_HATCHERY_ADDRESS,
      abi: COSMIC_HATCHERY_ABI,
      functionName: 'hatchEgg',
      value: cost,
    })
  }

  // Parse CreatureHatched event from transaction receipt logs
  const parseCreatureFromReceipt = (): { tokenId: number; creature: Creature } | null => {
    if (!receipt?.logs) return null
    
    for (const log of receipt.logs) {
      try {
        // Check if log is from our contract
        if (log.address.toLowerCase() !== COSMIC_HATCHERY_ADDRESS.toLowerCase()) continue
        
        const decoded = decodeEventLog({
          abi: COSMIC_HATCHERY_ABI,
          data: log.data,
          topics: log.topics,
        })
        
        if (decoded.eventName === 'CreatureHatched') {
          const args = decoded.args as {
            owner: `0x${string}`
            tokenId: bigint
            rarity: number
            element: number
            species: number
            power: number
            ability: number
          }
          return {
            tokenId: Number(args.tokenId),
            creature: {
              rarity: args.rarity,
              element: args.element,
              species: args.species,
              power: args.power,
              ability: args.ability,
              birthBlock: BigInt(0),
            }
          }
        }
      } catch {
        // Not our event, continue
      }
    }
    return null
  }

  return {
    hatch,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
    receipt,
    parseCreatureFromReceipt,
  }
}

export function useCreaturesByOwner(address?: `0x${string}`) {
  return useReadContract({
    address: COSMIC_HATCHERY_ADDRESS,
    abi: COSMIC_HATCHERY_ABI,
    functionName: 'getCreaturesByOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })
}

export function useCreature(tokenId: bigint) {
  return useReadContract({
    address: COSMIC_HATCHERY_ADDRESS,
    abi: COSMIC_HATCHERY_ABI,
    functionName: 'getCreature',
    args: [tokenId],
  })
}

export function useUserBalance() {
  const { address } = useAccount()
  
  return useReadContract({
    address: COSMIC_HATCHERY_ADDRESS,
    abi: COSMIC_HATCHERY_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })
}

export function useTotalByRarity(rarity: number) {
  return useReadContract({
    address: COSMIC_HATCHERY_ADDRESS,
    abi: COSMIC_HATCHERY_ABI,
    functionName: 'totalByRarity',
    args: [rarity],
  })
}

