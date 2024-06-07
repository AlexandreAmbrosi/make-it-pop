import { getSession } from '@/lib/utils/auth'
import type { RequestEvent } from './$types'
import { redirect } from '@sveltejs/kit'

export async function load({ cookies }: RequestEvent) {
  const session = getSession(cookies)
  if (session) throw redirect(302, '/')
}
