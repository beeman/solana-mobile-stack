import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase58Decoder,
  type Instruction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  type TransactionSigner,
} from '@solana/kit'
import { createSolanaClient } from '@solana-mobile-stack/solana-client'
import { type GetExplorerUrlProps, useWalletUi } from '@wallet-ui/react'
import { useCallback } from 'react'

/**
 * Custom hook to abstract Wallet UI and related functionality from your app.
 *
 * This is a great place to add custom shared Solana logic or clients.
 */
export function useSolana() {
  const { cluster, ...walletUi } = useWalletUi()
  const client = createSolanaClient({ url: cluster.url })
  const explorer: Omit<GetExplorerUrlProps, 'path'> = {
    network: cluster,
    provider: 'solana',
  }

  const signAndSendTransaction = useCallback(
    async ({
      ixs,
      signer,
    }: {
      ixs: Instruction[]
      signer: TransactionSigner
    }) => {
      const { value: latestBlockhash } = await client.rpc
        .getLatestBlockhash()
        .send()
      const tx = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions(ixs, tx),
      )
      const signatureBytes = await signAndSendTransactionMessageWithSigners(tx)

      return getBase58Decoder().decode(signatureBytes)
    },
    [client],
  )

  return {
    ...walletUi,
    client,
    cluster,
    explorer,
    signAndSendTransaction,
  }
}
