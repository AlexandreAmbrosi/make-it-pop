import isAdmin from '@/lib/utils/admin'
import { sendEmail } from '@/lib/utils/email'
import { webResponse } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function POST({ cookies, request }: RequestEvent) {
  // Parse the JSON data from the request body
  const context = await request.json()
  // Check if the requester is an admin
  // If the requester is not an admin, return a 403 Forbidden response
  if (!isAdmin(cookies, request)) return webResponse(null, 403, {})
  await sendEmail({
    text: context.text,
    subject: context.subject,
    from: 'LaunchFa.st Demo <verification@launchfa.st>',
    to: typeof context.to === 'string' ? [context.to] : context.to,
  })
  // Return a successful response with a status code of 200
  return webResponse(null, 200, {})
}
