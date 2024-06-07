import { getAccess } from '@/lib/db'
import type { RequestEvent } from './$types'
import { getSession } from '@/lib/utils/auth'

export async function load({ cookies }: RequestEvent) {
  const session = getSession(cookies)
  let paid
  if (session?.email) paid = await getAccess(session.email.toString())
  return { session, paid }
}
