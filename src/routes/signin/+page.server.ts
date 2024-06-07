import { getSession } from '@/lib/utils/auth'
import type { RequestEvent } from './$types'
import { redirect } from '@sveltejs/kit'

export async function load(event: RequestEvent) {
  const session = getSession(event.cookies)
  if (session) throw redirect(302, '/')
}
