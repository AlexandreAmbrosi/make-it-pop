export const prerender = true

import { error } from '@sveltejs/kit'
import { allDocs } from 'content-collections'
import type { PageLoad } from './$types'

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  return allDocs.map((i) => ({ slug: i._meta.path.replace('.svelte', '') }))
}

export const load: PageLoad = ({ params }) => {
  const post = allDocs.find((i) => i._meta.path.replace('.svelte', '') === params.slug)
  if (!post) error(404)
  return { post }
}
