import { env } from '$env/dynamic/private'
import type { Cookies } from '@sveltejs/kit'

// A function to assess whether a user is admin based on the header value
export default function isAdmin(cookies: Cookies, request: Request) {
  // const session = await getSession(cookies)
  const xAccessKey = request.headers.get('x-access-key')
  if (xAccessKey) return xAccessKey === env.PRIVATE_ACCESS_KEY
  return false
}
