import { signOut } from '@/auth'
import { redirect } from '@sveltejs/kit'
import type { Actions, RequestEvent } from './$types'

export async function load(event: RequestEvent) {
  await event.fetch(event.url, {
    method: 'POST',
    body: new FormData(),
  })
  redirect(302, '/')
}

export const actions = { default: signOut } satisfies Actions
