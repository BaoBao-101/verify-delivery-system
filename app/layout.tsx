import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import '@iota/dapp-kit/dist/index.css'
import { Providers } from './providers'
import { WalletConnect } from '@/components/WalletConnect'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Theme appearance="light" accentColor="purple">
            <WalletConnect />
            {children}
          </Theme>
        </Providers>
      </body>
    </html>
  )
}
