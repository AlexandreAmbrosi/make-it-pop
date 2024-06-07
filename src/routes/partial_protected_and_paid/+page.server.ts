import { getAccess } from '@/lib/db'
import type { RequestEvent } from './$types'
import { getSession } from '@/lib/utils/auth'

export async function load(event: RequestEvent) {
  const session = getSession(event.cookies)
  let paid
  if (session?.email) paid = await getAccess(session.email.toString())
  return { session, paid }
}
