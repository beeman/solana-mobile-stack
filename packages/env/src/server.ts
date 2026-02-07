import 'dotenv/config'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGINS: z
      .string()
      .transform((val) => val.split(',').map((url) => url.trim()))
      .pipe(z.array(z.url())),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    SOLANA_CLUSTER: z
      .enum(['devnet', 'testnet', 'localnet', 'custom', 'mainnet'])
      .default('devnet'),
    SOLANA_EMAIL_DOMAIN: z.string().default('example.com'),
    SOLANA_ENDPOINT: z.url().default('https://api.devnet.solana.com'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
