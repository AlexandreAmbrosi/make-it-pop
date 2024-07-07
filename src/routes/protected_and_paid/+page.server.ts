import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { getAccess } from '@/lib/db'

export async function load({ locals }: RequestEvent) {
  const session = await locals.auth()
  if (!session?.user?.email) throw error(403, { message: 'Unauthorized' })
  const paid = await getAccess(session.user.email.toString())
  if (paid !== 1) throw error(403, { message: 'Unauthorized' })
  return session
}
