import redis from '@/lib/db/upstash'
import type { RequestEvent } from './$types'
import { getSession } from '@/lib/utils/auth'

export async function load(event: RequestEvent) {
  const session = getSession(event.request)
  const paid = session?.email ? await redis.hget('access', session?.email) : 0
  return { session, paid }
}
