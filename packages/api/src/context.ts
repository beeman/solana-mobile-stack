import { auth } from '@solana-mobile-stack/auth'
import { env } from '@solana-mobile-stack/env/server'
import { createSolanaClient } from '@solana-mobile-stack/solana-client'
import type { Context as HonoContext } from 'hono'

export type CreateContextOptions = {
  context: HonoContext
}

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  })

  const solana = createSolanaClient({
    url: env.SOLANA_ENDPOINT,
  })

  return {
    session,
    solana,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
