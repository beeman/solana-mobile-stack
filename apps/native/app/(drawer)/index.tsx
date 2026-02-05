import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { Card, Chip, useThemeColor } from 'heroui-native'
import { Pressable, Text, View } from 'react-native'

import { Container } from '@/components/container'
import { SignIn } from '@/components/sign-in'
import { SignUp } from '@/components/sign-up'
import { SolanaConnect } from '@/components/solana-connect'
import { SolanaSignInButton } from '@/components/solana-sign-in-button'
import { authClient } from '@/lib/auth-client'
import { orpc, queryClient } from '@/utils/orpc'

export default function Home() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions())
  const privateData = useQuery(orpc.privateData.queryOptions())
  const isConnected = healthCheck?.data === 'OK'
  const isLoading = healthCheck?.isLoading
  const { data: session } = authClient.useSession()

  const mutedColor = useThemeColor('muted')
  const successColor = useThemeColor('success')
  const dangerColor = useThemeColor('danger')

  return (
    <Container className="space-y-6 p-6">
      <View className="mb-6 py-4">
        <Text className="mb-2 font-bold text-4xl text-foreground">
          solana-mobile-stack
        </Text>
      </View>

      <View className="mb-6">
        <SolanaConnect />
      </View>

      {session?.user ? (
        <Card variant="secondary" className="mb-6 p-4">
          <Text className="mb-2 text-base text-foreground">
            Welcome, <Text className="font-medium">{session.user.name}</Text>
          </Text>
          <Text className="mb-4 text-muted text-sm">{session.user.email}</Text>
          <Pressable
            className="self-start rounded-lg bg-danger px-4 py-3 active:opacity-70"
            onPress={() => {
              authClient.signOut()
              queryClient.invalidateQueries()
            }}
          >
            <Text className="font-medium text-foreground">Sign Out</Text>
          </Pressable>
        </Card>
      ) : null}

      <Card variant="secondary" className="p-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Card.Title>System Status</Card.Title>
          <Chip
            variant="secondary"
            color={isConnected ? 'success' : 'danger'}
            size="sm"
          >
            <Chip.Label>{isConnected ? 'LIVE' : 'OFFLINE'}</Chip.Label>
          </Chip>
        </View>

        <Card className="p-4">
          <View className="flex-row items-center">
            <View
              className={`mr-3 h-3 w-3 rounded-full ${isConnected ? 'bg-success' : 'bg-muted'}`}
            />
            <View className="flex-1">
              <Text className="mb-1 font-medium text-foreground">
                ORPC Backend
              </Text>
              <Card.Description>
                {isLoading
                  ? 'Checking connection...'
                  : isConnected
                    ? 'Connected to API'
                    : 'API Disconnected'}
              </Card.Description>
            </View>
            {isLoading && (
              <Ionicons name="hourglass-outline" size={20} color={mutedColor} />
            )}
            {!isLoading && isConnected && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={successColor}
              />
            )}
            {!isLoading && !isConnected && (
              <Ionicons name="close-circle" size={20} color={dangerColor} />
            )}
          </View>
        </Card>
      </Card>

      <Card variant="secondary" className="my-6 p-4">
        <Card.Title className="mb-3">Private Data</Card.Title>
        <Card.Description>
          {privateData.data?.message || 'You are signed out'}
        </Card.Description>
      </Card>

      {!session?.user && (
        <View className="flex gap-6">
          <SolanaSignInButton />
          <View className="flex-row items-center gap-4">
            <View className="h-[1] flex-1 bg-muted/20" />
            <Text className="text-muted text-xs uppercase">
              Or continue with email
            </Text>
            <View className="h-[1] flex-1 bg-muted/20" />
          </View>
          <SignIn />
          <SignUp />
        </View>
      )}
    </Container>
  )
}
