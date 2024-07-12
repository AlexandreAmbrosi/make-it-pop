import { env } from '$env/dynamic/private'
import { getCode, ifUserExists, removeCode, setCode, setPassword } from '@/lib/db'
import { generateRandomString, generateRandomToken } from '@/lib/utils/auth'
import { sendEmail } from '@/lib/utils/email'
import { webRedirect, webResponse } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

export async function POST({ request }: RequestEvent) {
  // Parse the incoming form data from the 'request'
  const context = await request.formData()
  // Check if form data exists
  // If no form data is found, return a 400 Bad Request response
  if (!context) return webResponse('Invalid body.', 400, {})
  // Extract the user's code, email and password from the form data
  const userCode = context.get('code') as string
  const userEmail = context.get('email') as string
  const userPassword = context.get('password') as string
  // Check if both email and password are provided
  // If either email or password is missing, return a 400 Bad Request response
  if (!userEmail) return webResponse('No email submitted.', 400, {})
  const validCode = await getCode(userCode)
  if (validCode) {
    if (validCode === userEmail) {
      if (!userPassword) return webResponse('No password submitted.', 400, {})
      await setPassword(userEmail, generateRandomString(userPassword))
      await sendEmail({
        from: 'LaunchFa.st Demo <verification@launchfa.st>',
        to: userEmail,
        subject: '[LaunchFa.st]: Successful password reset.',
        text: `Hello,\n\nYou have reset your password for the LaunchFa.st account associated with this email address (${userEmail}) successfully.\n\nThanks,\n\nLaunchFa.st`,
      })
      await removeCode(userCode)
    }
  } else {
    // Attempt to retrieve the original password associated with the user's email
    const originalPassword = await ifUserExists(userEmail)
    // If the user does not exist with the given email, redirect to sign up
    if (!originalPassword) return webRedirect('/signup', 302, {})
    const token = 'forgot_' + generateRandomToken()
    // Store the generated token in the database associated with the 'email'
    await setCode(token, userEmail)
    // If the user is found, send them an email with special `code` parameter to reset password
    await sendEmail({
      from: 'LaunchFa.st Demo <verification@launchfa.st>',
      to: userEmail,
      subject: '[LaunchFa.st]: Instructions for changing your LaunchFa.st password',
      text: `Hello,\n\nYou have asked to reset your password for the LaunchFa.st account associated with this email address (${userEmail}).\n\nTo reset the password, please click on the following link:\n\n${env.EMAIL_PASSWORD_RESET_URL}?code=${token}\n\nThanks,\n\nLaunchFa.st`,
    })
  }
  return webRedirect('/signin', 302, {})
}
