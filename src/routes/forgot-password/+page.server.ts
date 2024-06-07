import { getCode } from '@/lib/db'
import { getSession } from '@/lib/utils/auth'
import { redirect } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

export async function load(event: RequestEvent) {
  const session = getSession(event.cookies)
  if (session) throw redirect(302, '/')
  let validCode = false
  const code = new URL(event.request.url).searchParams.get('code')
  try {
    if (code) validCode = await getCode(code)
  } catch (e) {}
  return { code, validCode }
}
