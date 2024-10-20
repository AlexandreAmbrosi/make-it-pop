import { getCode } from '@/lib/db'
import { redirect } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

export async function load({ locals, request }: RequestEvent) {
  const session = await locals.auth()
  if (session) redirect(302, '/')
  let validCode = false
  const code = new URL(request.url).searchParams.get('code')
  try {
    if (code) validCode = await getCode(code)
  } catch (e) {}
  return { code, validCode }
}
