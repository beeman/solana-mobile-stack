import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Search, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useSolana } from '@/components/solana/use-solana.tsx'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { WalletDropdown } from '@/components/wallet-dropdown.tsx'
import { PlaygroundFeature } from '@/features/playground/playground-feature.tsx'
import { orpc } from '@/utils/orpc'

export const Route = createFileRoute('/solana')({
  component: SolanaRoute,
})

function SolanaRoute() {
  const { cluster, wallet } = useSolana()
  const [address, setAddress] = useState(
    'SEekKY1iUoWYJqZ3d9QBsfJytNx5RLBjBmgznkGrqbH',
  )

  const balanceMutation = useMutation({
    ...orpc.solana.getBalance.mutationOptions(),
  })

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      balanceMutation.mutate({ address })
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 py-10">
      {wallet ? (
        <PlaygroundFeature cluster={cluster.id} wallet={wallet} />
      ) : (
        <WalletDropdown />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Solana Balance
          </CardTitle>
          <CardDescription>
            Check the balance of any Solana address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCheckBalance} className="space-y-2">
            <label htmlFor="address" className="font-medium text-sm">
              Wallet Address
            </label>
            <div className="flex gap-2">
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Solana address..."
                disabled={balanceMutation.isPending}
              />
              <Button
                type="submit"
                disabled={balanceMutation.isPending || !address.trim()}
              >
                {balanceMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>

          <div className="rounded-lg bg-muted p-4">
            {balanceMutation.isIdle ? (
              <div className="py-4 text-center text-muted-foreground italic">
                Enter an address and click search to check the balance
              </div>
            ) : balanceMutation.isPending ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : balanceMutation.isError ? (
              <div className="py-4 text-center text-destructive">
                Error: {balanceMutation.error.message}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Balance</p>
                <p className="font-bold text-3xl">
                  {balanceMutation.data?.value !== undefined
                    ? (
                        Number(balanceMutation.data.value) / 1_000_000_000
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 9,
                      })
                    : '0.000000000'}{' '}
                  SOL
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
