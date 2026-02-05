import { createEmptyClient } from '@solana/kit'
import { rpc } from '@solana/kit-plugin-rpc'

export function createSolanaClient({
  url,
  urlWs,
}: {
  url: string
  urlWs?: string
}) {
  urlWs = urlWs ?? url.replace('http', 'ws').replace('8899', '8900')
  return createEmptyClient().use(rpc(url, urlWs ? { url: urlWs } : undefined))
}
