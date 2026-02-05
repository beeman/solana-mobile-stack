import { Button, Spinner } from 'heroui-native'
import { useSolanaSignIn } from '@/hooks/use-solana-sign-in'

export function SolanaSignInButton() {
  const { handleSignIn, isLoading } = useSolanaSignIn()

  return (
    <Button onPress={handleSignIn} isDisabled={isLoading} variant="secondary">
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <Button.Label>Sign in with Solana</Button.Label>
      )}
    </Button>
  )
}
