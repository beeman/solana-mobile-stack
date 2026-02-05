import type { BetterAuthClientPlugin } from 'better-auth/client'
import type { solanaAuth } from './solana-auth'

export function solanaAuthClient() {
  return {
    id: 'solana-auth',
    $InferServerPlugin: {} as ReturnType<typeof solanaAuth>,
  } satisfies BetterAuthClientPlugin
}

export * from './types'
