import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import SignInForm from '@/components/sign-in-form'
import SignUpForm from '@/components/sign-up-form'
import { SolanaSignInCard } from '@/components/solana-sign-in-card.tsx'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false)

  return (
    <div className="container mx-auto max-w-md space-y-6 py-8">
      <SolanaSignInCard />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>
      {showSignIn ? (
        <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
      )}
    </div>
  )
}
