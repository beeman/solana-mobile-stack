import type { ExplorerPath } from '@wallet-ui/react'
import { ArrowUpRightFromSquare } from 'lucide-react'
import type { ReactNode } from 'react'
import { WalletUiExplorerLink } from '@/components/wallet-ui-explorer-link.tsx'
import { cn } from '@/lib/utils.ts'

export function AppExplorerLink({
  className,
  label,
  path,
}: {
  className?: string
  label?: ReactNode
  path: ExplorerPath
}) {
  return (
    <WalletUiExplorerLink
      className={cn('link inline-flex gap-1 font-mono', className)}
      path={path}
    >
      {label}
      <ArrowUpRightFromSquare size={12} />
    </WalletUiExplorerLink>
  )
}
