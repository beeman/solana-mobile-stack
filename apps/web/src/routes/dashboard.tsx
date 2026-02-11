import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  ErrorComponent,
  redirect,
} from '@tanstack/react-router'

import { getUser } from '@/functions/get-user'
import { orpc } from '@/utils/orpc'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    console.error('[dashboard] Route error:', error)
    return <ErrorComponent error={error} />
  },
  beforeLoad: async () => {
    try {
      const session = await getUser()
      return { session }
    } catch (error) {
      console.error('[dashboard] beforeLoad error:', error)
      throw error
    }
  },
  loader: async ({
    context,
  }: {
    context: { session: Awaited<ReturnType<typeof getUser>> | null }
  }) => {
    if (!context.session) {
      throw redirect({
        to: '/login',
      })
    }
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()

  const privateData = useQuery(orpc.privateData.queryOptions())

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      <p>API: {privateData.data?.message}</p>
    </div>
  )
}
