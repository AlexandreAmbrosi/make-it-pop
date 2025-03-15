import { adapter, getPassword, setCode, setPassword } from '@/lib/db'
import storage from '@/lib/storage'
import { comparePassword, generateRandomString, generateRandomToken, hashPassword } from '@/lib/utils/auth.server'
import { sendEmail } from '@/lib/utils/email'
import type { Provider } from '@auth/sveltekit/providers'
import Credentials from '@auth/sveltekit/providers/credentials'
import GitHub from '@auth/sveltekit/providers/github'
import Google from '@auth/sveltekit/providers/google'
import type { RequestEvent } from '@sveltejs/kit'
import { v4 as uuidv4 } from 'uuid'
import { getEnv } from './lib/utils/env'

export const getProviders = (event?: RequestEvent): Provider[] => {
  return [
    Google({
      clientId: getEnv('GOOGLE_CLIENT_ID', event),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET', event),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GitHub({
      clientId: getEnv('GITHUB_CLIENT_ID', event),
      clientSecret: getEnv('GITHUB_CLIENT_SECRET', event),
    }),
    Credentials({
      credentials: {
        username: { label: 'Email', type: 'email', placeholder: 'contact@launchfa.st' },
        password: { label: 'Password', type: 'password', placeholder: '*********' },
      },
      async authorize(credentials, _) {
        if (typeof credentials?.username !== 'string') throw new Error('Username not found.')
        if (typeof credentials?.password !== 'string') throw new Error('Password not found.')
        // Add your own email validation logic
        const doesUserExist = await getPassword(credentials.username)
        // Sign In
        if (doesUserExist) {
          // console.log('Signing In', credentials.username)
          // Generate a randomized password based on the user's input password
          const randomizedPassword = generateRandomString(credentials.password)
          // Hash the randomized password
          const hashedPassword = hashPassword(randomizedPassword)
          // Compare the hashed randomized password with the original password
          const isPasswordCorrect = comparePassword(doesUserExist, hashedPassword)
          if (isPasswordCorrect) {
            const user_details = await adapter.getUserByEmail?.(credentials.username)
            if (!user_details?.id) return null
            if (user_details?.image) user_details.image = user_details.image.includes('https:') ? user_details.image : await storage.retrieve(user_details.image)
            // If the passwords match, create a session cookie for the user
            return { id: user_details.id, image: user_details.image, email: user_details.email, name: user_details.name }
          } else {
            console.log('Password did not match.')
            return null
          }
        } else {
          // Sign Up
          const randomizedPassword = generateRandomString(credentials.password)
          await setPassword(credentials.username, randomizedPassword)
          await adapter.createUser?.({ id: uuidv4(), email: credentials.username, name: 'Username Placeholder', emailVerified: null })
          const emailVerificationURL = getEnv('EMAIL_VERIFICATION_ENDPOINT_URL')
          if (emailVerificationURL) {
            // Check if 'email' exists
            // Generate a random token
            const token = generateRandomToken()
            // Store the generated token in the database associated with the 'email'
            await setCode(credentials.username, token)
            // Construct the email verification URL
            const verificationUrl = new URL(emailVerificationURL)
            verificationUrl.searchParams.set('token', token)
            // Send an email with the verification link to the user
            await sendEmail({
              from: 'LaunchFa.st Demo <verification@launchfa.st>',
              to: credentials.username,
              subject: 'Verify email address',
              text: `Click the following link to verify your email address: ${verificationUrl.toString()}. Make sure that you are signed into your account in another window to correctly verify your email.`,
            })
          }
          const user_details = await adapter.getUserByEmail?.(credentials.username)
          if (!user_details?.id) return null
          return { id: user_details.id, image: user_details.image, email: user_details.email, name: user_details.name }
        }
      },
    }),
  ]
}
