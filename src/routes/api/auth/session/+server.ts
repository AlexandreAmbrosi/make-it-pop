import { webJson } from '@/lib/utils/web'
import type { RequestEvent } from './$types'
import { getLatestSession } from './latest'

export async function GET({ cookies }: RequestEvent) {
  const session = await getLatestSession(cookies)
  return webJson(session, 200, {})
}
