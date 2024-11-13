export const prerender = true

import { allBlogs } from 'content-collections'
import type { PageLoad } from './$types'

export const load: PageLoad = () => ({
  blogs: allBlogs.map((i) => {
    const { content, ...rest } = i
    return rest
  }),
})
