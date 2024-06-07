import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { getSession } from '@/lib/utils/auth'
import { getAccess } from '@/lib/db'

export async function load(event: RequestEvent) {
  const session = getSession(event.cookies)
  if (!session) throw error(403, { message: 'Unauthorized' })
  const paid = await getAccess(session.email.toString())
  if (paid !== 1) throw error(403, { message: 'Unauthorized' })
  return session
}
