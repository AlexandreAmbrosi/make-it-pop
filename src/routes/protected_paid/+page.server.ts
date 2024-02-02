import redis from '@/lib/db/upstash'
import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { getSession } from '@/lib/utils/auth'

export async function load(event: RequestEvent) {
  const session = getSession(event.request)
  if (!session) {
    throw error(403, { message: 'Unauthorized' })
  }
  const paid = await redis.hget('access', session.email)
  if (paid !== 1) {
    throw error(403, { message: 'Unauthorized' })
  }
  return session
}
