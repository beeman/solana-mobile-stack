import type { UiWallet, UiWalletAccount } from '@wallet-ui/react'
import { LucideKey } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useCallback, useState } from 'react'
import { useHandleSiwsAuthMutation } from '@/components/solana/use-handle-siws-auth-mutation.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

export function PlaygroundUiWalletFeatureSignIn({
  account,
  onError,
  onSuccess,
  wallet,
}: {
  account: UiWalletAccount
  onError(err: unknown): void
  onSuccess(account: UiWalletAccount | undefined): void
  wallet: UiWallet
}) {
  const [statement, setStatement] = useState('Sign in to solana-mobile-stack')
  const { mutateAsync, isPending } = useHandleSiwsAuthMutation({
    account,
    wallet,
    statement,
    onSuccess: () => onSuccess(account),
    onError,
  })

  const handleSignInClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault()
      await mutateAsync()
    },
    [mutateAsync],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In with Solana</CardTitle>
        <CardDescription>Authenticate using your Solana wallet</CardDescription>
        <CardAction>
          <Button
            size="lg"
            variant="outline"
            disabled={isPending}
            onClick={handleSignInClick}
          >
            {isPending ? <Spinner /> : <LucideKey />}
            Sign in
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Custom sign-in message"
          onChange={(e) => setStatement(e.currentTarget.value)}
          value={statement}
        />
      </CardContent>
    </Card>
  )
}
