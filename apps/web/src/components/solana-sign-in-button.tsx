import { type UiWallet, useConnect, WalletUiIcon } from '@wallet-ui/react'
import { useCallback, useState } from 'react'
import { SolanaSignInButtonConnected } from '@/components/solana-sign-in-button-connected.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

export function SolanaSignInButton({ wallet }: { wallet: UiWallet }) {
  const [, connect] = useConnect(wallet)
  const [isLoading, setIsConnecting] = useState(false)

  const account = wallet.accounts[0]

  const handleClick = useCallback(async () => {
    setIsConnecting(true)
    try {
      await connect()
    } finally {
      setIsConnecting(false)
    }
  }, [connect])

  if (account) {
    return <SolanaSignInButtonConnected account={account} wallet={wallet} />
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner className="size-5" />
      ) : (
        <WalletUiIcon wallet={wallet} className="size-5" />
      )}
      <span className="flex-1 text-left">Connect {wallet.name}</span>
    </Button>
  )
}
