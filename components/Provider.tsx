'use client'

import { IotaClientProvider, WalletProvider } from '@iota/dapp-kit'
import { getFullnodeUrl } from '@iota/iota-sdk/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@iota/dapp-kit/dist/index.css'

const queryClient = new QueryClient()
const network = 'testnet'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={{ [network]: { url: getFullnodeUrl(network) } }} defaultNetwork={network}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  )
}
