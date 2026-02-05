import {
  type Address,
  assertIsAddress,
  assertIsSignature,
  getBase58Encoder,
  getPublicKeyFromAddress,
  type Signature,
  signatureBytes,
  verifySignature,
} from '@solana/kit'

/**
 * Verify an Ed25519 signature using Web Crypto API
 *
 * @param address - Solana wallet address (base58 public key)
 * @param signature - Base58-encoded signature
 * @param message - The message that was signed (as Uint8Array)
 * @returns Promise<boolean> - true if signature is valid
 */
export async function verifySolanaSignature({
  address,
  message,
  signature,
}: {
  address: Address
  signature: Signature
  message: string
}): Promise<boolean> {
  assertIsAddress(address)
  assertIsSignature(signature)

  try {
    // Get the CryptoKey for this Address for Ed25519 verification
    const key = await getPublicKeyFromAddress(address)

    // Verify the signature
    return await verifySignature(
      key,
      signatureBytes(getBase58Encoder().encode(signature)),
      new TextEncoder().encode(message),
    )
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

/**
 * Generate a cryptographically secure nonce
 */
export function generateNonce(length = 16): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  // Convert to alphanumeric string
  return Array.from(array, (byte) => byte.toString(36))
    .join('')
    .slice(0, length)
}
