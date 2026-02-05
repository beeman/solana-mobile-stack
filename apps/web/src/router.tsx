import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import './index.css'
import Loader from './components/loader'
import { SolanaProvider } from './components/solana/solana-provider'
import { routeTree } from './routeTree.gen'
import { orpc, queryClient } from './utils/orpc'

export const getRouter = () => {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { orpc, queryClient },
    defaultPendingComponent: () => <Loader />,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    Wrap: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <SolanaProvider>{children}</SolanaProvider>
      </QueryClientProvider>
    ),
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
