// File: svelte.config.js

import 'dotenv/config'
import path from 'path'
import adapter from './adapter.mjs'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter,
    alias: {
      '@/*': path.resolve('./src/'),
    },
    csrf: {
      checkOrigin: false,
    },
  },
}
