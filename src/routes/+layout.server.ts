import { getSession } from '@/lib/utils/auth'
import type { RequestEvent } from './$types'

export async function load({ cookies }: RequestEvent) {
  const session = getSession(cookies)
  return { session }
}
