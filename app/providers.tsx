'use client'

import { IotaClientProvider, WalletProvider } from '@iota/dapp-kit'
import { getFullnodeUrl } from '@iota/iota-sdk/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const queryClient = new QueryClient()

// Choose network: 'mainnet', 'testnet', or 'devnet'
const network = 'testnet'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={{ [network]: { url: getFullnodeUrl(network) } }} defaultNetwork={network}>
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  )
}
