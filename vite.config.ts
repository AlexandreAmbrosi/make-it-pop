import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import { sveltekit } from '@sveltejs/kit/vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
    }),
  ],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
  },
})
