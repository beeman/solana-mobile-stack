import {
  type Address,
  assertIsSignature,
  getBase58Decoder,
  type Signature,
} from '@solana/kit'
import type {
  SolanaAuthNonceResponse,
  SolanaAuthVerifyResponse,
} from '@solana-mobile-stack/better-auth-solana/types'
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
  WalletAccount,
} from '@wallet-ui/react'

export async function handleSiwsAuth({
  address,
  baseUrl,
  refresh,
  signIn,
  statement,
}: {
  address: Address
  baseUrl: string
  refresh: () => Promise<void>
  signIn: (input: SolanaSignInInput) => Promise<SolanaSignInOutput>
  statement: string
}) {
  const nonce = await fetchNonce({ address, baseUrl })
  const { signature, message } = await createAndSignMessage({
    nonce,
    address,
    statement,
    signIn,
  })
  const verifyData = await verifyMessage({
    address,
    baseUrl,
    signature,
    message,
  })
  await refresh()
  return verifyData
}

async function fetchNonce({
  address,
  baseUrl,
}: {
  address: Address
  baseUrl: string
}): Promise<SolanaAuthNonceResponse> {
  const response = await fetch(`${baseUrl}/api/auth/solana-auth/nonce`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress: address }),
    credentials: 'include',
  })

  if (!response.ok) {
    let errorMessage = 'Failed to fetch nonce'
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {
      // Response wasn't JSON
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

async function createAndSignMessage({
  address,
  nonce,
  signIn,
  statement,
}: {
  address: Address
  nonce: SolanaAuthNonceResponse
  signIn: (input: SolanaSignInInput) => Promise<SolanaSignInOutput>
  statement: string
}): Promise<{ account: WalletAccount; message: string; signature: Signature }> {
  const input = createSignInInput({ address, nonce, statement })
  const { account, signedMessage, signature } = await signIn(input)

  return {
    account,
    message: new TextDecoder().decode(signedMessage),
    signature: signatureBytesToSignature(signature),
  }
}

function signatureBytesToSignature(bytes: Uint8Array<ArrayBufferLike>) {
  const signature = getBase58Decoder().decode(bytes)
  assertIsSignature(signature)
  return signature
}

function createSignInInput({
  address,
  nonce,
  statement,
}: {
  address: Address
  nonce: SolanaAuthNonceResponse
  statement: string
}): SolanaSignInInput {
  return {
    address,
    chainId: nonce.chainId,
    domain: nonce.domain,
    uri: nonce.uri,
    version: '1',
    statement,
    nonce: nonce.nonce,
    issuedAt: nonce.issuedAt,
    expirationTime: nonce.expirationTime,
  }
}

async function verifyMessage({
  address,
  baseUrl,
  signature,
  message,
}: {
  address: Address
  baseUrl: string
  signature: Signature
  message: string
}): Promise<SolanaAuthVerifyResponse> {
  const response = await fetch(`${baseUrl}/api/auth/solana-auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress: address, signature, message }),
    credentials: 'include',
  })

  if (!response.ok) {
    let errorMessage = 'Failed to verify signature'
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {
      // Response wasn't JSON
    }
    throw new Error(errorMessage)
  }

  return response.json()
}
