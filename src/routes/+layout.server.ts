import { getSession } from '@/lib/utils/auth'
import type { LayoutServerLoad } from './$types'

export async function load({ cookies, request }: LayoutServerLoad) {
  const session = getSession(cookies)
  const disableUser = new URL(request.url).pathname.includes('/blog')
  return { session, disableUser }
}
