import type { BetterAuthPlugin } from 'better-auth'

export interface SolanaAuthOptions {
  /**
   * The domain for SIWS messages (e.g., "example.com")
   */
  domain: string
  /**
   * Domain name for generated emails when anonymous auth is allowed
   * @default "solana.local"
   */
  emailDomainName?: string
  /**
   * Allow authentication without email
   * @default true
   */
  anonymous?: boolean
  /**
   * Nonce expiration time in milliseconds
   * @default 900000 (15 minutes)
   */
  nonceExpirationMs?: number
  /**
   * Solana cluster identifier
   * @default "mainnet"
   */
  cluster?: 'mainnet' | 'devnet' | 'testnet' | 'localnet' | 'custom'
}

export type SolanaAuthPlugin = (options: SolanaAuthOptions) => BetterAuthPlugin

export interface SolanaAuthNonceResponse {
  nonce: string
  domain: string
  uri: string
  issuedAt: string
  expirationTime: string
  chainId: string
}

export interface SolanaAuthVerifyResponse {
  user: {
    id: string
    email: string
    name: string
  }
  session: {
    id: string
    token: string
  }
  isNewUser: boolean
}

export interface SolanaAuthWalletsResponse {
  wallets: Array<{
    id: string
    address: string
    cluster: string
    isPrimary: boolean
  }>
}
