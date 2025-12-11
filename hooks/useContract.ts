// hooks/useContract.ts
import { useState, useEffect } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@iota/dapp-kit'
import { Transaction } from '@iota/iota-sdk/transactions'

const PACKAGE_ID = '0x0932c3c2f94c8a3aff78b581a87529e5ac6850fc73bd019a63e7b39b17e269fb'
const MODULE_NAME = 'delivery_verification'

enum DeliveryStatus {
  PENDING = 0,
  IN_TRANSIT = 1,
  OUT_FOR_DELIVERY = 2,
  DELIVERED = 3,
  CANCELLED = 4,
}

const STATUS_MAP: { [key: number]: string } = {
  0: 'PENDING',
  1: 'IN_TRANSIT',
  2: 'OUT_FOR_DELIVERY',
  3: 'DELIVERED',
  4: 'CANCELLED',
}

interface DeliveryData {
  trackingId: string
  recipient: string
  destination: string
  items: string
  status: string
  owner: string
  createdAt: number
  deliveredAt: number
}

interface ContractState {
  isPending: boolean
  isLoading: boolean
  isConfirmed: boolean
  error: Error | null
  hash: string | null
}

export const useContract = () => {
  const currentAccount = useCurrentAccount()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  
  const [objectId, setObjectId] = useState<string | null>(null)
  const [data, setData] = useState<DeliveryData | null>(null)
  const [state, setState] = useState<ContractState>({
    isPending: false,
    isLoading: false,
    isConfirmed: false,
    error: null,
    hash: null
  })

  useEffect(() => {
    const stored = localStorage.getItem('delivery_object_id')
    if (stored) setObjectId(stored)
  }, [])

  useEffect(() => {
    if (objectId && currentAccount) {
      fetchDeliveryData()
    }
  }, [objectId, currentAccount])

  const fetchDeliveryData = async () => {
    if (!objectId) return
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch(`/api/delivery/${objectId}`)
      if (!response.ok) throw new Error('Failed to fetch delivery data')
      const result = await response.json()
      setData({
        ...result,
        status: STATUS_MAP[result.status] || 'PENDING'
      })
      setState(prev => ({ ...prev, isLoading: false }))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }))
    }
  }

  const createDelivery = async (trackingId: string, recipient: string, destination: string, items: string) => {
    if (!currentAccount) throw new Error('Wallet not connected')
    setState(prev => ({ ...prev, isPending: true, error: null }))
    try {
      const tx = new Transaction()
      const encoder = new TextEncoder()
      
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::create_delivery`,
        arguments: [
          tx.pure('vector<u8>', Array.from(encoder.encode(trackingId))),
          tx.pure('vector<u8>', Array.from(encoder.encode(recipient))),
          tx.pure('vector<u8>', Array.from(encoder.encode(destination))),
          tx.pure('vector<u8>', Array.from(encoder.encode(items))),
        ],
      })
      
      signAndExecuteTransaction({ transaction: tx }, {
        onSuccess: (result) => {
          const createdObjectId = result.effects?.created?.[0]?.reference?.objectId
          if (createdObjectId) {
            setObjectId(createdObjectId)
            localStorage.setItem('delivery_object_id', createdObjectId)
          }
          setState(prev => ({ ...prev, isPending: false, isConfirmed: true, hash: result.digest }))
          setTimeout(fetchDeliveryData, 1000)
        },
        onError: (error) => {
          setState(prev => ({ ...prev, isPending: false, error: error as Error }))
        }
      })
    } catch (error) {
      setState(prev => ({ ...prev, isPending: false, error: error as Error }))
    }
  }

  const updateStatus = async (newStatus: number) => {
    if (!currentAccount || !objectId) throw new Error('Wallet not connected or no delivery object')
    setState(prev => ({ ...prev, isPending: true, error: null }))
    try {
      const tx = new Transaction()
      
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::update_status`,
        arguments: [
          tx.object(objectId),
          tx.pure('u8', newStatus),
        ],
      })
      
      signAndExecuteTransaction({ transaction: tx }, {
        onSuccess: (result) => {
          setState(prev => ({ ...prev, isPending: false, isConfirmed: true, hash: result.digest }))
          setTimeout(fetchDeliveryData, 1000)
        },
        onError: (error) => {
          setState(prev => ({ ...prev, isPending: false, error: error as Error }))
        }
      })
    } catch (error) {
      setState(prev => ({ ...prev, isPending: false, error: error as Error }))
    }
  }

  const confirmDelivery = async () => {
    if (!currentAccount || !objectId) throw new Error('Wallet not connected or no delivery object')
    setState(prev => ({ ...prev, isPending: true, error: null }))
    try {
      const tx = new Transaction()
      
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::confirm_delivery`,
        arguments: [tx.object(objectId)],
      })
      
      signAndExecuteTransaction({ transaction: tx }, {
        onSuccess: (result) => {
          setState(prev => ({ ...prev, isPending: false, isConfirmed: true, hash: result.digest }))
          setTimeout(fetchDeliveryData, 1000)
        },
        onError: (error) => {
          setState(prev => ({ ...prev, isPending: false, error: error as Error }))
        }
      })
    } catch (error) {
      setState(prev => ({ ...prev, isPending: false, error: error as Error }))
    }
  }

  const clearObject = () => {
    setObjectId(null)
    setData(null)
    localStorage.removeItem('delivery_object_id')
    setState({ isPending: false, isLoading: false, isConfirmed: false, error: null, hash: null })
  }

  return {
    data,
    actions: {
      createDelivery,
      updateStatus,
      confirmDelivery,
      clearObject,
    },
    state,
    objectId,
    isOwner: currentAccount?.address === data?.owner,
    objectExists: !!data,
    hasValidData: !!(data?.trackingId && data?.recipient),
  }
}
