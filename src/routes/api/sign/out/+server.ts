import { webRedirect } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function GET(event: RequestEvent) {
  // Clear the authentication cookie
  event.cookies.set('custom_auth', '', { path: '/', httpOnly: true, expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') })
  // Create a response that performs logout by setting an empty cookie with an expiration date in the past
  return webRedirect('/', 302, {})
}
