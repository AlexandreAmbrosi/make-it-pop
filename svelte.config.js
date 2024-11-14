import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import adapter from './adapter.mjs'

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess()],
  kit: {
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter,
    alias: {
      '@/*': path.resolve('./src/'),
      'content-collections': path.resolve('./.content-collections/generated'),
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
