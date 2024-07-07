import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

export async function load({ locals }: RequestEvent) {
  const session = await locals.auth()
  if (!session) throw error(403, { message: 'Unauthorized' })
  return session
}
