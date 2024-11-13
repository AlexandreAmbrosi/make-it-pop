export const prerender = true

import { allBlogs } from 'content-collections'
import type { PageLoad } from './$types'

export const load: PageLoad = () => ({
  blogs: allBlogs.map((i) => {
    const tmp = { ...i }
    delete tmp['content']
    return tmp
  }),
})
