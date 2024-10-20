export const prerender = true

const slugFromPath = (path: string) => path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  const modules = import.meta.glob(`/src/blogs/*.{md,svx,svelte.md}`)
  return Object.entries(modules).map((i) => ({ slug: i[0].replace('/src/blogs/', '').replace('.svelte.md', '') }))
}

import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob(`/src/blogs/*.{md,svx,svelte.md}`)
  let match: { path?: string; resolver?: App.MdsvexResolver } = {}
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
