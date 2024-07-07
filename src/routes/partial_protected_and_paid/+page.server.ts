import { getAccess } from '@/lib/db'
import type { RequestEvent } from './$types'

export async function load({ locals }: RequestEvent) {
  let paid
  const session = await locals.auth()
  if (session?.user?.email) paid = await getAccess(session.user.email.toString())
  return { session, paid }
}
