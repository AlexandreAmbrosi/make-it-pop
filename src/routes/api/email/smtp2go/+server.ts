import { isAdmin } from '@/lib/utils/auth.server'
import { sendEmail } from '@/lib/utils/email'
import { webJson } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function POST(event: RequestEvent) {
  // Parse the JSON data from the request body
  const context = await event.request.json()
  // Check if the requester is an admin
  // If the requester is not an admin, return a 403 Forbidden response
  if (!isAdmin(event.cookies, event.request)) return webJson({}, 403, {})
  await sendEmail(
    {
      text: context.text,
      subject: context.subject,
      from: context['verified_sender'] ?? 'jain71000@gmail.com',
      to: typeof context.to === 'string' ? [context.to] : context.to,
    },
    'smtp2go',
  )
  // Return a successful response with a status code of 200
  return webJson({}, 200, {})
}
