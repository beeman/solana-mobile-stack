import { LucideWallet } from 'lucide-react'
import { useSolana } from '@/components/solana/use-solana'
import { SolanaSignInButton } from '@/components/solana-sign-in-button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SolanaSignInCard() {
  const { wallets } = useSolana()

  if (wallets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LucideWallet className="size-5" />
            Sign in with Solana
          </CardTitle>
          <CardDescription>
            No Solana wallets detected. Please install a wallet extension.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LucideWallet className="size-5" />
          Sign in with Solana
        </CardTitle>
        <CardDescription>
          Connect your wallet to sign in securely
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {wallets.map((wallet) => (
          <SolanaSignInButton key={wallet.name} wallet={wallet} />
        ))}
      </CardContent>
    </Card>
  )
}
