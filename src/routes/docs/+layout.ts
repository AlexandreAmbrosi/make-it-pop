export const prerender = true

import { redirect } from '@sveltejs/kit'
import { allDocs } from 'content-collections'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) =>
  params.slug === ''
    ? redirect(302, '/docs/introduction')
    : {
        docs: allDocs.map((i) => {
          const tmp = { ...i }
          delete tmp['content']
          return tmp
        }),
      }
