import { getCode, removeCode, setMailVerified } from '@/lib/db'
import { sendEmail } from '@/lib/utils/email'
import { webJson, webRedirect } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function GET(event: RequestEvent) {
  // Parse the URL from the 'request' object
  const url = new URL(event.request.url)
  // Extract the 'token' query parameter from the URL
  const token_from_url = url.searchParams.get('token')
  // Get the user session from the 'request'
  const session = await event.locals.auth()
  // Check if a valid session exists
  if (session?.user?.email) {
    // Extract the 'email' property from the session
    const { email } = session.user
    // Retrieve the stored token associated with the 'email' from the database
    const token = await getCode(email)
    // Check if the retrieved token matches the 'token_from_url'
    if (token === token_from_url) {
      // If the tokens match, mark the user's email as verified
      await setMailVerified(email, '1')
      await removeCode(email)
      // Send the email that the email is now verified
      await sendEmail({
        from: 'LaunchFa.st Demo <verification@launchfa.st>',
        to: email,
        subject: 'Email verification successful',
        text: `Your email verification was succesful.`,
      })
      // Return a success response with a status code of 200
      return webRedirect('/', 302, {})
    }
    // If the tokens do not match, return an 'invalid token' response with a status code of 403
    return webJson({ message: 'invalid token' }, 403, {})
  }
  // If no valid session or email was found, return a 'could not verify' response with a status code of 500
  return webJson({ message: 'could not verify' }, 500, {})
}
