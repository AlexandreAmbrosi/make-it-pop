export const prerender = true

import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

const slugFromPath = (path: string) => path.replace('/src/content/docs/', '').replace('.svelte.md', '').replace('.md', '').replace('index', '')

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  const modules = import.meta.glob('/src/content/docs/**/*.{md,svx,svelte.md}')
  return Object.entries(modules).map((i) => ({ slug: slugFromPath(i[0]) }))
}

export const load: PageLoad = async ({ params }) => {
  let match: { path?: string; resolver?: App.MdsvexResolver } = {}
  const modules = import.meta.glob('/src/content/docs/**/*.{md,svx,svelte.md}')
  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromPath(path) === params.slug) {
      match = { path, resolver: resolver as unknown as App.MdsvexResolver }
      break
    }
  }
  const post = await match?.resolver?.()
  if (!post || !post.metadata.published) error(404)
  return {
    component: post.default,
    frontmatter: post.metadata,
  }
}
