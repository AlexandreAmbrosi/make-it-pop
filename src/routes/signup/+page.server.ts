import { providerMap, signIn } from '@/auth.server'
import { redirect } from '@sveltejs/kit'
import type { Actions, RequestEvent } from './$types'

export async function load({ locals }: RequestEvent) {
  const session = await locals.auth()
  if (session) redirect(302, '/dashboard')
  return { providerMap }
}

export const actions: Actions = { default: signIn }
