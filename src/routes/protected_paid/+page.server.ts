import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { getAccess } from '@/lib/db'
import { getSession } from '@/lib/utils/auth'

export async function load({ cookies }: RequestEvent) {
  const session = getSession(cookies)
  if (!session) throw error(403, { message: 'Unauthorized' })
  const paid = await getAccess(session.email.toString())
  if (paid !== 1) throw error(403, { message: 'Unauthorized' })
  return session
}
