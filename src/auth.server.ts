import { adapter } from '@/lib/db'
import storage from '@/lib/storage'
import { SvelteKitAuth } from '@auth/sveltekit'
import { v4 as uuidv4 } from 'uuid'
import { getEnv } from './lib/utils/env'
import { getProviders } from './providers.server'

export const providerMap = getProviders().map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
  return {
    adapter,
    pages: {
      signIn: '/signin',
      signOut: '/signout',
    },
    session: {
      strategy: 'database',
    },
    providers: getProviders(event),
    secret: getEnv('AUTH_SECRET', event),
    trustHost: true,
    useSecureCookies: getEnv('NODE_ENV', event) === 'production',
    jwt: {
      async encode({ token }) {
        return token?.sessionId as unknown as string
      },
    },
    callbacks: {
      async jwt({ account, user, token }) {
        if (account?.provider === 'credentials' && user.id) {
          const tmp = await adapter.createSession?.({ sessionToken: uuidv4(), userId: user.id, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
          if (tmp?.sessionToken) token.sessionId = tmp.sessionToken
        }
        return token
      },
      async session({ session }) {
        if (session?.user?.email) {
          const user_details = await adapter.getUserByEmail?.(session.user.email)
          if (user_details?.image) session.user.image = user_details.image.includes('https:') ? user_details.image : await storage.retrieve(user_details.image)
        }
        return session
      },
    },
  }
})
