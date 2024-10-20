import { getAccess } from '@/lib/db'
import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

export async function load({ locals }: RequestEvent) {
  const session = await locals.auth()
  if (!session?.user?.email) error(403, { message: 'Unauthorized' })
  const paid = await getAccess(session.user.email.toString())
  if (paid !== 1) error(403, { message: 'Unauthorized' })
  return session
}
