import { getPassword } from '@/lib/db'
import { generateRandomString, getSession, signUp } from '@/lib/utils/auth'
import { webJson, webRedirect } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function POST(event: RequestEvent) {
  // Parse the incoming form data from the 'request'
  const context = await event.request.formData()
  // Check if form data exists
  if (!context) {
    // If no form data is found, return a 400 Bad Request response
    return webJson({ message: 'No user details submitted.' }, 400, {})
  }
  // Extract the user's email and password from the form data
  const userEmail = context.get('email')
  const userPassword = context.get('password')
  // Check if both email and password are provided
  if (!userEmail || !userPassword) {
    // If either email or password is missing, return a 400 Bad Request response
    return webJson({ message: 'Please make sure both email and password are submitted.' }, 400, {})
  }
  // Get the user session from the 'request'
  const session = getSession(event.cookies)
  // Check if no session is found (user is not logged in)
  if (!session) {
    // Generate a randomized password based on the user's input password
    const randomizedPassword = generateRandomString(userPassword)
    // Attempt to retrieve the original password associated with the user's email
    const originalPassword = await getPassword(userEmail)
    // If the original password does not exist (user is not registered), proceed with sign-up
    if (!originalPassword) {
      // Call the 'signUp' function to register the user with the randomized password
      return await signUp(event.cookies, userEmail, randomizedPassword)
    } else {
      // If the password didn't match the earlier one
      // If a session is found (user is already logged in), return a redirect response with a status code of 302
      return webJson({ message: 'There is a conflict with the current state of the resource.' }, 409, {})
    }
  } else {
    // If a session is found (user is already logged in), return a redirect response with a status code of 302
    return webRedirect('/', 302, {})
  }
}
