export const prerender = true

import { error } from '@sveltejs/kit'
import { allBlogs } from 'content-collections'
import type { PageLoad } from './$types'

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  return allBlogs.map((i) => ({ slug: i._meta.path.replace('.svelte', '') }))
}

export const load: PageLoad = async ({ params }) => {
  const post = allBlogs.find((i) => i._meta.path.replace('.svelte', '') === params.slug)
  if (!post) error(404)
  return {
    post,
  }
}
