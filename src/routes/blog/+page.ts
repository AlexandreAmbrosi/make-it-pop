export const prerender = true

import type { PageLoad } from './$types'

const slugFromPath = (path: string) => path.replace('/src/content/blogs/', '').replace('.svelte.md', '').replace('.md', '').replace('index', '')

export const load: PageLoad = async () => {
  const blogs = []
  const modules = import.meta.glob('/src/content/blogs/**/*.{md,svx,svelte.md}')
  for (const [path, resolver] of Object.entries(modules)) {
    const post = await resolver?.()
    blogs.push({ ...post?.metadata, file: slugFromPath(path) })
  }
  return { blogs }
}
