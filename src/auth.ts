import { comparePassword, generateRandomString, hashPassword } from '@/lib/utils/auth.server'
import type { Provider } from '@auth/core/providers'
import Credentials from '@auth/core/providers/credentials'
import Facebook from '@auth/core/providers/facebook'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import { SvelteKitAuth, type User } from '@auth/sveltekit'
import { getPassword, getUser, setPassword } from './lib/db'
import storage from './lib/storage'

const providers: Provider[] = [
  Google,
  Facebook,
  GitHub,
  Credentials({
    name: 'Credentials',
    credentials: {
      username: { label: 'Email', type: 'email', placeholder: 'contact@launchfa.st' },
      password: { label: 'Password', type: 'password', placeholder: '*********' },
    },
    async authorize(credentials, _) {
      if (typeof credentials?.username !== 'string') return null
      if (typeof credentials?.password !== 'string') return null
      // Add your own email validation logic
      const doesUserExist = await getPassword(credentials.username)
      // Sign In
      if (doesUserExist) {
        // console.log('Signing In', credentials.username)
        // Generate a randomized password based on the user's input password
        const randomizedPassword = generateRandomString(credentials.password)
        // Hash the randomized password
        const hashedPassword = await hashPassword(randomizedPassword)
        // Compare the hashed randomized password with the original password
        const isPasswordCorrect = await comparePassword(doesUserExist, hashedPassword)
        if (isPasswordCorrect) {
          const sessionObj: User = { email: credentials.username }
          const user_details = await getUser(credentials.username)
          const { image_ref, name } = user_details
          sessionObj['name'] = name || 'Placeholder Name'
          if (image_ref?.length > 0) {
            sessionObj['image'] = image_ref.includes('https:') ? image_ref : await storage.retrieve(image_ref)
          }
          // If the passwords match, create a session cookie for the user
          return sessionObj
        }
        // console.log('Password did not match.')
        return null
      } else {
        // Sign Up
        const sessionObj: User = { email: credentials.username }
        const randomizedPassword = generateRandomString(credentials.password)
        await setPassword(credentials.username, randomizedPassword)
        if (!sessionObj.name) sessionObj['name'] = 'Placeholder Name'
        // await sendVerificationEmail(credentials.username)
        return sessionObj
      }
    },
  }),
]

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})

export const { handle, signIn, signOut } = SvelteKitAuth({
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
  providers,
  trustHost: true,
  useSecureCookies: false,
  callbacks: {
    async session({ session }) {
      if (session?.user?.email) {
        const user_details = await getUser(session.user.email)
        if (user_details) {
          const { image_ref, name } = user_details
          if (name?.length > 0) session.user.name = name
          if (image_ref?.length > 0) {
            session.user.image = image_ref.includes('https:') ? image_ref : await storage.retrieve(image_ref)
          }
        }
      }
      return session
    },
  },
})
