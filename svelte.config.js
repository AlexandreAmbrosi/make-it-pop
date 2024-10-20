// File: svelte.config.js

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import path from 'path'
import adapter from './adapter.mjs'
import mdsvexConfig from './mdsvex.config.js'

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
