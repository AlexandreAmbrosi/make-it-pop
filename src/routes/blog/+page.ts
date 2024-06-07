export const prerender = true

import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const blogs = []
  const modules = import.meta.glob(`/src/blogs/*.{md,svx,svelte.md}`)
  for (const [path, resolver] of Object.entries(modules)) {
    const post = await resolver?.()
    if (post?.metadata) blogs.push({ ...post.metadata, file: path.replace('/src/blogs/', '').replace('.svelte.md', '') })
  }
  return { blogs }
}
