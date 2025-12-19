'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
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
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
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

  return {
    hatch,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
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

