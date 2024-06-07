import { env } from '$env/dynamic/private'
import { setCode } from '@/lib/db'
import resend from '@/lib/email/resend'
import { generateRandomToken, getSession } from '@/lib/utils/auth'
import { webRedirect } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function GET({ cookies, setHeaders }: RequestEvent) {
  // Get the user session from the cookies
  const session = getSession(cookies)
  // Check if a valid session exists
  if (session) {
    // Extract the 'email' property from the session
    const { email, google, twitter } = session
    // Set the user as verified in DB
    // Return a success response with a status code of 200
    if ((google && google === 1) || (twitter && twitter === 1)) return webRedirect('/', 302, {})
    if (email && typeof email === 'string') {
      // Check if 'email' exists
      // Generate a random token
      const token = generateRandomToken()
      // Store the generated token in the database associated with the 'email'
      await setCode(email, token)
      // Construct the email verification URL
      const verificationUrl = new URL(env.EMAIL_VERIFICATION_ENDPOINT_URL)
      verificationUrl.searchParams.set('token', token)
      // Send an email with the verification link to the user
      const emailResponse = await resend.emails.send({
        from: 'LaunchFa.st Demo <verification@launchfa.st>',
        to: email,
        subject: 'Verify email address',
        text: `Click the following link to verify your email address: ${verificationUrl.toString()}. Make sure that you are signed into your account in another window to correctly verify your email.`,
      })
      // Check if the email was sent successfully (HTTP status 200-299)
      // If the email was sent successfully, return a redirect response with a status code of 302
      if (emailResponse.id) {
        setHeaders({
          'email-sent': 'true',
        })
        return webRedirect('/', 302, {})
      }
    }
  }
  // If no valid session or email was found, return a redirect response with a status code of 302
  // and 'email-sent' set to false
  setHeaders({
    'email-sent': 'false',
  })
  return webRedirect('/', 302, {})
}
