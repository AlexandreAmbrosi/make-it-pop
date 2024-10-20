import { providerMap, signIn } from '@/auth'
import { redirect } from '@sveltejs/kit'
import type { Actions, RequestEvent } from './$types'

export async function load({ locals }: RequestEvent) {
  const session = await locals.auth()
  if (session) redirect(302, '/')
  return { providerMap }
}

export const actions = {
  default: signIn,
} satisfies Actions
