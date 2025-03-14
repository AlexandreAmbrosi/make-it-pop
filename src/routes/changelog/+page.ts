export const prerender = true

import { allChangelogs } from 'content-collections'
import type { PageLoad } from './$types'

export const load: PageLoad = () => ({
  changelog: allChangelogs.map((i) => {
    const { content, ...rest } = i
    return rest
  }),
})
