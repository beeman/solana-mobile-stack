import {
  type GetExplorerUrlProps,
  getExplorerUrl,
  useWalletUiCluster,
} from '@wallet-ui/react'
import { useCallback, useMemo } from 'react'

export function useWalletUiExplorer() {
  const { cluster } = useWalletUiCluster()
  const explorer = useMemo<Omit<GetExplorerUrlProps, 'path'>>(
    () => ({
      network: cluster,
      provider: 'solana',
    }),
    [cluster],
  )
  return useCallback(
    (path: GetExplorerUrlProps['path']) =>
      getExplorerUrl({ ...explorer, path }),
    [explorer],
  )
}
