import {
  appendTransactionMessageInstruction,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { useWalletAccountTransactionSigner } from '@solana/react'
import type { SolanaClient } from '@solana-mobile-stack/solana-client'
import { getAddMemoInstruction } from '@solana-program/memo'
import type { SolanaClusterId, UiWalletAccount } from '@wallet-ui/react'
import { LucideKey } from 'lucide-react'
import { type SyntheticEvent, useCallback, useMemo, useState } from 'react'
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
import { getErrorMessage } from './playground-ui-error.tsx'

export function PlaygroundUiWalletFeatureSignTransaction({
  account,
  cluster,
  client,
  onError,
  onSuccess,
}: {
  account: UiWalletAccount
  client: SolanaClient
  cluster: SolanaClusterId
  onError(err: unknown): void
  onSuccess(signature: string | undefined): void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState<string>('Hello Solana!')
  const transactionSigner = useWalletAccountTransactionSigner(account, cluster)
  const sendAndConfirmTransaction = useMemo(
    () => sendAndConfirmTransactionFactory(client),
    [client],
  )

  const signTransaction = useCallback(async () => {
    const { value: latestBlockhash } = await client.rpc
      .getLatestBlockhash({ commitment: 'confirmed' })
      .send()
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (m) => setTransactionMessageFeePayerSigner(transactionSigner, m),
      (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
      (m) =>
        appendTransactionMessageInstruction(
          getAddMemoInstruction({ memo: text }),
          m,
        ),
    )

    const transaction = await signTransactionMessageWithSigners(message)
    assertIsTransactionWithBlockhashLifetime(transaction)
    const signature = getSignatureFromTransaction(transaction)
    await sendAndConfirmTransaction(transaction, { commitment: 'confirmed' })

    if (!signature) {
      throw new Error()
    }
    return signature
  }, [client.rpc, sendAndConfirmTransaction, text, transactionSigner])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
          const signature = await signTransaction()
          onSuccess(signature)
        } catch (e) {
          console.log('e', e)
          onError(getErrorMessage(e, 'Unknown error occurred'))
        } finally {
          setIsLoading(false)
        }
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Sign Transaction</CardTitle>
          <CardDescription>Sign a Transaction with a memo text</CardDescription>
          <CardAction>
            <Button
              size="lg"
              variant="outline"
              disabled={!text || isLoading}
              type="submit"
            >
              {isLoading ? <Spinner /> : <LucideKey />}
              Sign Transaction
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Write a memo text sign as transaction"
            onChange={(e: SyntheticEvent<HTMLInputElement>) =>
              setText(e.currentTarget.value)
            }
            value={text}
          />
        </CardContent>
      </Card>
    </form>
  )
}
