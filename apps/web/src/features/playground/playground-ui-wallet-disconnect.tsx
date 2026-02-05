import { type UiWallet, useDisconnect } from '@wallet-ui/react'
import { LucideUnplug } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

export function PlaygroundUiWalletDisconnect({ wallet }: { wallet: UiWallet }) {
  const [isLoading, disconnect] = useDisconnect(wallet)

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={isLoading}
      onClick={() => disconnect()}
    >
      {isLoading ? <Spinner /> : <LucideUnplug />}
      Disconnect
    </Button>
  )
}
