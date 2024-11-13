import { sveltekit } from '@sveltejs/kit/vite'
import fb from 'fast-glob'
import { existsSync, readFileSync } from 'fs'
import * as pagefind from 'pagefind'
import { join, relative } from 'path'
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
      async closeBundle() {
        if (process.env.BLOG_SEARCH === 'enable') {
          const sourcePath =
            process.env.DEPLOYMENT_PLATFORM === 'vercel'
              ? join('.vercel', 'output', 'static')
              : process.env.DEPLOYMENT_PLATFORM === 'netlify'
                ? join('build')
                : join('build', 'prerendered')
          if (existsSync(sourcePath)) {
            const outputPath =
              process.env.DEPLOYMENT_PLATFORM === 'vercel'
                ? join('.vercel', 'output', 'static', 'pagefind')
                : process.env.DEPLOYMENT_PLATFORM === 'netlify'
                  ? join('build', 'pagefind')
                  : join('build', 'client', 'pagefind')
            const { index } = await pagefind.createIndex()
            if (index) {
              const paths = [...fb.globSync([join(sourcePath, 'blog', '**', '*')], { dot: true }), ...fb.globSync(join(sourcePath, 'docs', '**', '*'), { dot: true })]
              await Promise.all(
                paths.map((j) =>
                  index.addHTMLFile({
                    url: relative(sourcePath, j).replace('.html', ''),
                    sourcePath: relative(sourcePath, j),
                    content: readFileSync(j, 'utf8'),
                  }),
                ),
              )
              await index.writeFiles({ outputPath })
            }
          }
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
