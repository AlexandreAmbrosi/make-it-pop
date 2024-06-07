// File: svelte.config.js

import path from 'path'
import { mdsvex } from 'mdsvex'
import adapter from './adapter.mjs'
import mdsvexConfig from './mdsvex.config.js'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter,
    alias: {
      '@/*': path.resolve('./src/'),
    },
    csrf: {
      checkOrigin: false,
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        console.log(path, referrer, message)
      },
      handleMissingId: 'ignore',
    },
  },
}
