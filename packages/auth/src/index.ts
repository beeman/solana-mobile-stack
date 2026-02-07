import { expo } from '@better-auth/expo'
import { solanaAuth } from '@solana-mobile-monorepo/better-auth-solana'
import { db } from '@solana-mobile-monorepo/db'
import * as schema from '@solana-mobile-monorepo/db/schema/auth'
import { env } from '@solana-mobile-monorepo/env/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',

    schema: schema,
  }),
  trustedOrigins: [
    ...env.CORS_ORIGINS,
    ...(env.NODE_ENV === 'development'
      ? [
          'exp://',
          'exp://**',
          'solana-mobile-monorepo://**',
          'exp://192.168.*.*:*/**',
          'http://localhost:8081',
        ]
      : []),
  ],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    expo(),
    solanaAuth({
      domain: new URL(env.BETTER_AUTH_URL).hostname,
      anonymous: true,
      cluster: env.SOLANA_CLUSTER,
      emailDomainName: env.SOLANA_EMAIL_DOMAIN,
    }),
  ],
})
