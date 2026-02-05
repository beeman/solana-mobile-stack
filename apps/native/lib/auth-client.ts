import { expoClient } from '@better-auth/expo/client'
import { solanaAuthClient } from '@solana-mobile-stack/better-auth-solana/client'
import { env } from '@solana-mobile-stack/env/native'
import { createAuthClient } from 'better-auth/react'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
    solanaAuthClient(),
  ],
})
