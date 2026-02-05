import {
  type SolanaClusterId,
  type UiWallet,
  WalletUiIcon,
} from '@wallet-ui/react'
import { Fragment } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'sonner'
import { AppExplorerLink } from '@/components/app-explorer-link.tsx'
import { useSolana } from '@/components/solana/use-solana.tsx'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { PlaygroundUiError } from './playground-ui-error.tsx'
import { PlaygroundUiWalletAddress } from './playground-ui-wallet-address.tsx'
import { PlaygroundUiWalletConnect } from './playground-ui-wallet-connect.tsx'
import { PlaygroundUiWalletDisconnect } from './playground-ui-wallet-disconnect.tsx'
import { PlaygroundUiWalletFeatureSignAndSendTransaction } from './playground-ui-wallet-feature-sign-and-send-transaction.tsx'
import { PlaygroundUiWalletFeatureSignMessage } from './playground-ui-wallet-feature-sign-message.tsx'
import { PlaygroundUiWalletFeatureSignTransaction } from './playground-ui-wallet-feature-sign-transaction.tsx'
import { PlaygroundUiWalletOverview } from './playground-ui-wallet-overview.tsx'

export function PlaygroundFeature({
  cluster,
  wallet,
}: {
  cluster: SolanaClusterId
  wallet: UiWallet
}) {
  const { client } = useSolana()
  const connected = !!wallet.accounts?.length
  const account = wallet.accounts.length ? wallet.accounts[0] : undefined
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <WalletUiIcon className="size-8" wallet={wallet} />
            <span>{wallet.name}</span>
          </CardTitle>
          <CardDescription>
            {connected ? (
              <PlaygroundUiWalletAddress address={account?.address} />
            ) : (
              `Connect to ${wallet.name} to see the accounts`
            )}
          </CardDescription>
          <CardAction className="space-x-2">
            {connected ? (
              <PlaygroundUiWalletDisconnect wallet={wallet} />
            ) : (
              <PlaygroundUiWalletConnect wallet={wallet} />
            )}
          </CardAction>
        </CardHeader>
      </Card>
      <PlaygroundUiWalletOverview wallet={wallet} />
      {account ? (
        <Fragment>
          <ErrorBoundary
            resetKeys={[wallet.name]}
            fallbackRender={({ error }) => <PlaygroundUiError error={error} />}
          >
            <PlaygroundUiWalletFeatureSignMessage
              account={account}
              onError={(err) =>
                toast.error('Error signing message', { description: `${err}` })
              }
              onSuccess={(signature) =>
                toast.success('Signing message success', {
                  description: (
                    <PlaygroundUiWalletAddress address={signature} len={10} />
                  ),
                })
              }
              wallet={wallet}
            />
          </ErrorBoundary>
          <ErrorBoundary
            resetKeys={[wallet.name]}
            fallbackRender={({ error }) => <PlaygroundUiError error={error} />}
          >
            <PlaygroundUiWalletFeatureSignAndSendTransaction
              account={account}
              client={client}
              cluster={cluster}
              onError={(err) =>
                toast.error('Error signing and sending transaction', {
                  description: `${err}`,
                })
              }
              onSuccess={(signature) =>
                toast.success('Signing and sending transaction success', {
                  description: (
                    <AppExplorerLink
                      label={
                        <PlaygroundUiWalletAddress
                          address={signature}
                          len={10}
                        />
                      }
                      path={`/tx/${signature}`}
                    />
                  ),
                })
              }
            />
          </ErrorBoundary>
          <ErrorBoundary
            resetKeys={[wallet.name]}
            fallbackRender={({ error }) => <PlaygroundUiError error={error} />}
          >
            <PlaygroundUiWalletFeatureSignTransaction
              account={account}
              client={client}
              cluster={cluster}
              onError={(err) =>
                toast.error('Error signing transaction', {
                  description: `${err}`,
                })
              }
              onSuccess={(signature) =>
                toast.success('Signing transaction success', {
                  description: (
                    <AppExplorerLink
                      label={
                        <PlaygroundUiWalletAddress
                          address={signature}
                          len={10}
                        />
                      }
                      path={`/tx/${signature}`}
                    />
                  ),
                })
              }
            />
          </ErrorBoundary>
        </Fragment>
      ) : null}
    </div>
  )
}
