import { getPassword } from '@/lib/db'
import { comparePassword, createCookie, generateRandomString, getSession, hashPassword } from '@/lib/utils/auth'
import { webJson, webRedirect } from '@/lib/utils/web'
import { getLatestSession } from '../../auth/session/latest'
import type { RequestEvent } from './$types'

export async function POST(event: RequestEvent) {
  // Parse the incoming form data from the 'request'
  const context = await event.request.formData()
  // Check if form data exists
  // If no form data is found, return a 400 Bad Request response
  if (!context) return webJson({ message: 'Invalid body.' }, 400, {})
  // Extract the user's email and password from the form data
  const userEmail = context.get('email') as string
  const userPassword = context.get('password') as string
  // Check if both email and password are provided
  // If either email or password is missing, return a 400 Bad Request response
  if (!userEmail || !userPassword) return webJson({ message: 'No user details submitted.' }, 400, {})
  // Generate a randomized password based on the user's input password
  const randomizedPassword = generateRandomString(userPassword)
  // Get the user session from the 'request'
  const session = getSession(event.cookies)
  // Check if no session is found (user is not logged in)
  if (!session) {
    // Attempt to retrieve the original password associated with the user's email
    const originalPassword = await getPassword(userEmail)
    // Sign In Flow
    if (originalPassword) {
      // Hash the randomized password
      const hashedPassword = await hashPassword(randomizedPassword)
      // Compare the hashed randomized password with the original password
      const isPasswordCorrect = await comparePassword(originalPassword, hashedPassword)
      if (isPasswordCorrect) {
        const tmpSession = await getLatestSession(event.cookies, { email: userEmail })
        // If the passwords match, create a session cookie for the user
        const cookie = createCookie(tmpSession)
        // Return a redirect response with a status code of 302 and the session cookie
        event.cookies.set('custom_auth', cookie, { path: '/', httpOnly: true })
        return webRedirect('/', 302, {})
      } else {
        // If the passwords don't match, return a 401 Unauthorized response
        return webRedirect('/signup', 302, {})
      }
    } else {
      // If the original password is not found, return a 404 Not Found response
      return webRedirect('/signup', 302, {})
    }
  } else {
    // If a session is found (user is already logged in), return a redirect response with a status code of 302
    return webRedirect('/', 302, {})
  }
}
