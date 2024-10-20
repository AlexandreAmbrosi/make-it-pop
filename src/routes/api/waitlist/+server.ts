import { addToWaitlist } from '@/lib/db'
import { webJson } from '@/lib/utils/web'
import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

export async function POST(event: RequestEvent) {
  // Parse the incoming form data from the 'request'
  const context = await event.request.formData()
  // Extract the 'email' from the form data
  const email = context.get('email')
  // If 'email' is missing, return a 400 Bad Request response
  if (!email || typeof email !== 'string') error(400)
  // Add the 'email' to the waitlist in the database
  await addToWaitlist(email)
  // Return a successful response with a status code of 200
  return webJson({}, 200, {})
}
