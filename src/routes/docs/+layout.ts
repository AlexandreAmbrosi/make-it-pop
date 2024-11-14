export const prerender = true

import config from '@/config'
import { redirect } from '@sveltejs/kit'
import { allDocs } from 'content-collections'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ params }) =>
  params.slug === ''
    ? redirect(302, config.docsRedirect)
    : {
        docs: allDocs.map((i) => {
          const { content, ...rest } = i
          return rest
        }),
      }
