import { getSession } from '@/lib/utils/auth'
import type { RequestEvent } from './$types'

export async function load({ cookies, request }: RequestEvent) {
  const session = getSession(cookies)
  const disableUser = new URL(request.url).pathname.includes('/blog')
  return { session, disableUser }
}
