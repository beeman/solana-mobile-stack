import type { ExplorerPath } from '@wallet-ui/react'
import type { ComponentProps, ReactNode } from 'react'
import { useWalletUiExplorer } from '@/components/use-wallet-ui-explorer.tsx'

export interface WalletUiExplorerLinkProps extends ComponentProps<'a'> {
  children: ReactNode
  path: ExplorerPath
}

export function WalletUiExplorerLink({
  children,
  path,
  ...props
}: WalletUiExplorerLinkProps) {
  const getExplorerUrl = useWalletUiExplorer()
  return (
    <a
      href={getExplorerUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  )
}
