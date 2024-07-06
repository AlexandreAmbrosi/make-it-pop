import { sveltekit } from '@sveltejs/kit/vite'
import { spawnSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
    }),
    {
      name: 'pagefind',
      closeBundle() {
        const sourcePath =
          process.env.DEPLOYMENT_PLATFORM === 'vercel'
            ? join('.vercel', 'output', 'static', 'blog')
            : process.env.DEPLOYMENT_PLATFORM === 'netlify'
              ? join('build', 'blog')
              : join('build', 'prerendered', 'blog')
        if (existsSync(sourcePath)) {
          console.log('[LaunchFa.st]: Indexing blogs...')
          const destinationPath =
            process.env.DEPLOYMENT_PLATFORM === 'vercel'
              ? join('.vercel', 'output', 'static', 'pagefind')
              : process.env.DEPLOYMENT_PLATFORM === 'netlify'
                ? join('build', 'pagefind')
                : join('build', 'client', 'pagefind')
          console.log(`[LaunchFa.st]: Executing "npx -y pagefind --site ${sourcePath} --output-path ${destinationPath}"`)
          spawnSync('npx', [`-y pagefind --site ${sourcePath} --output-path ${destinationPath}`], { stdio: 'inherit', shell: true })
          console.log('[LaunchFa.st]: Blogs indexed succesfully!')
        }
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
  },
  preview: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
  },
})
