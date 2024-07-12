import { env } from '$env/dynamic/private'
import { setCode } from '@/lib/db'
import { generateRandomToken } from '@/lib/utils/auth'
import { sendEmail } from '@/lib/utils/email'
import { webRedirect } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function GET({ locals, setHeaders }: RequestEvent) {
  // Get the user session
  const session = await locals.auth()
  // Check if a valid session exists
  if (session?.user?.email) {
    // Check if 'email' exists
    // Generate a random token
    const token = generateRandomToken()
    // Store the generated token in the database associated with the 'email'
    await setCode(session.user.email, token)
    // Construct the email verification URL
    const verificationUrl = new URL(env.EMAIL_VERIFICATION_ENDPOINT_URL)
    verificationUrl.searchParams.set('token', token)
    // Send an email with the verification link to the user
    await sendEmail({
      from: 'LaunchFa.st Demo <verification@launchfa.st>',
      to: session.user.email,
      subject: 'Verify email address',
      text: `Click the following link to verify your email address: ${verificationUrl.toString()}. Make sure that you are signed into your account in another window to correctly verify your email.`,
    })
    // Check if the email was sent successfully (HTTP status 200-299)
    // If the email was sent successfully, return a redirect response with a status code of 302
    setHeaders({
      'email-sent': 'true',
    })
    return webRedirect('/', 302, {})
  }
  // If no valid session or email was found, return a redirect response with a status code of 302
  // and 'email-sent' set to false
  setHeaders({
    'email-sent': 'false',
  })
  return webRedirect('/', 302, {})
}
