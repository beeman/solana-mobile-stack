import { solanaAuthClient } from '@solana-mobile-stack/better-auth-solana/client'
import { env } from '@solana-mobile-stack/env/web'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [solanaAuthClient()],
})
