import { getCode } from '@/lib/db'
import { redirect } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { getSession } from '@/lib/utils/auth'

export async function load({ cookies, request }: RequestEvent) {
  const session = getSession(cookies)
  if (session) throw redirect(302, '/')
  let validCode = false
  const code = new URL(request.url).searchParams.get('code')
  try {
    if (code) validCode = await getCode(code)
  } catch (e) {}
  return { code, validCode }
}
