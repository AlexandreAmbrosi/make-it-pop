// vite.config.ts
import contentCollections from 'file:///home/rishi/launchfa.st-sveltekit/node_modules/@content-collections/vite/dist/index.js'
import { sveltekit } from 'file:///home/rishi/launchfa.st-sveltekit/node_modules/@sveltejs/kit/src/exports/vite/index.js'
import fb from 'file:///home/rishi/launchfa.st-sveltekit/node_modules/fast-glob/out/index.js'
import * as pagefind from 'file:///home/rishi/launchfa.st-sveltekit/node_modules/pagefind/lib/index.js'
import Icons from 'file:///home/rishi/launchfa.st-sveltekit/node_modules/unplugin-icons/dist/vite.js'
import { defineConfig } from 'file:///home/rishi/launchfa.st-sveltekit/node_modules/vite/dist/node/index.js'
import { existsSync, readFileSync } from 'fs'
import { join, relative } from 'path'
var vite_config_default = defineConfig({
  plugins: [
    sveltekit(),
    contentCollections(),
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
    port: 3e3,
    open: true,
    host: '0.0.0.0',
  },
  preview: {
    port: 3e3,
    open: true,
    host: '0.0.0.0',
  },
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9yaXNoaS9sYXVuY2hmYS5zdC1zdmVsdGVraXRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Jpc2hpL2xhdW5jaGZhLnN0LXN2ZWx0ZWtpdC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9yaXNoaS9sYXVuY2hmYS5zdC1zdmVsdGVraXQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnXG5pbXBvcnQgZmIgZnJvbSAnZmFzdC1nbG9iJ1xuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYWdlZmluZCBmcm9tICdwYWdlZmluZCdcbmltcG9ydCB7IGpvaW4sIHJlbGF0aXZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBjb250ZW50Q29sbGVjdGlvbnMgZnJvbSBcIkBjb250ZW50LWNvbGxlY3Rpb25zL3ZpdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHN2ZWx0ZWtpdCgpLFxuICAgIGNvbnRlbnRDb2xsZWN0aW9ucygpLFxuICAgIEljb25zKHtcbiAgICAgIGNvbXBpbGVyOiAnc3ZlbHRlJyxcbiAgICB9KSxcbiAgICB7XG4gICAgICBuYW1lOiAncGFnZWZpbmQnLFxuICAgICAgYXN5bmMgY2xvc2VCdW5kbGUoKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5CTE9HX1NFQVJDSCA9PT0gJ2VuYWJsZScpIHtcbiAgICAgICAgICBjb25zdCBzb3VyY2VQYXRoID1cbiAgICAgICAgICAgIHByb2Nlc3MuZW52LkRFUExPWU1FTlRfUExBVEZPUk0gPT09ICd2ZXJjZWwnXG4gICAgICAgICAgICAgID8gam9pbignLnZlcmNlbCcsICdvdXRwdXQnLCAnc3RhdGljJylcbiAgICAgICAgICAgICAgOiBwcm9jZXNzLmVudi5ERVBMT1lNRU5UX1BMQVRGT1JNID09PSAnbmV0bGlmeSdcbiAgICAgICAgICAgICAgICA/IGpvaW4oJ2J1aWxkJylcbiAgICAgICAgICAgICAgICA6IGpvaW4oJ2J1aWxkJywgJ3ByZXJlbmRlcmVkJylcbiAgICAgICAgICBpZiAoZXhpc3RzU3luYyhzb3VyY2VQYXRoKSkge1xuICAgICAgICAgICAgY29uc3Qgb3V0cHV0UGF0aCA9XG4gICAgICAgICAgICAgIHByb2Nlc3MuZW52LkRFUExPWU1FTlRfUExBVEZPUk0gPT09ICd2ZXJjZWwnXG4gICAgICAgICAgICAgICAgPyBqb2luKCcudmVyY2VsJywgJ291dHB1dCcsICdzdGF0aWMnLCAncGFnZWZpbmQnKVxuICAgICAgICAgICAgICAgIDogcHJvY2Vzcy5lbnYuREVQTE9ZTUVOVF9QTEFURk9STSA9PT0gJ25ldGxpZnknXG4gICAgICAgICAgICAgICAgICA/IGpvaW4oJ2J1aWxkJywgJ3BhZ2VmaW5kJylcbiAgICAgICAgICAgICAgICAgIDogam9pbignYnVpbGQnLCAnY2xpZW50JywgJ3BhZ2VmaW5kJylcbiAgICAgICAgICAgIGNvbnN0IHsgaW5kZXggfSA9IGF3YWl0IHBhZ2VmaW5kLmNyZWF0ZUluZGV4KClcbiAgICAgICAgICAgIGlmIChpbmRleCkge1xuICAgICAgICAgICAgICBjb25zdCBwYXRocyA9IFsuLi5mYi5nbG9iU3luYyhbam9pbihzb3VyY2VQYXRoLCAnYmxvZycsICcqKicsICcqJyldLCB7IGRvdDogdHJ1ZSB9KSwgLi4uZmIuZ2xvYlN5bmMoam9pbihzb3VyY2VQYXRoLCAnZG9jcycsICcqKicsICcqJyksIHsgZG90OiB0cnVlIH0pXVxuICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBwYXRocy5tYXAoKGopID0+XG4gICAgICAgICAgICAgICAgICBpbmRleC5hZGRIVE1MRmlsZSh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogcmVsYXRpdmUoc291cmNlUGF0aCwgaikucmVwbGFjZSgnLmh0bWwnLCAnJyksXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVBhdGg6IHJlbGF0aXZlKHNvdXJjZVBhdGgsIGopLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiByZWFkRmlsZVN5bmMoaiwgJ3V0ZjgnKSxcbiAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgYXdhaXQgaW5kZXgud3JpdGVGaWxlcyh7IG91dHB1dFBhdGggfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICBvcGVuOiB0cnVlLFxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgfSxcbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgb3BlbjogdHJ1ZSxcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUixTQUFTLGlCQUFpQjtBQUMvUyxPQUFPLFFBQVE7QUFDZixTQUFTLFlBQVksb0JBQW9CO0FBQ3pDLFlBQVksY0FBYztBQUMxQixTQUFTLE1BQU0sZ0JBQWdCO0FBQy9CLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLHdCQUF3QjtBQUUvQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixtQkFBbUI7QUFBQSxJQUNuQixNQUFNO0FBQUEsTUFDSixVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsSUFDRDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTSxjQUFjO0FBQ2xCLFlBQUksUUFBUSxJQUFJLGdCQUFnQixVQUFVO0FBQ3hDLGdCQUFNLGFBQ0osUUFBUSxJQUFJLHdCQUF3QixXQUNoQyxLQUFLLFdBQVcsVUFBVSxRQUFRLElBQ2xDLFFBQVEsSUFBSSx3QkFBd0IsWUFDbEMsS0FBSyxPQUFPLElBQ1osS0FBSyxTQUFTLGFBQWE7QUFDbkMsY0FBSSxXQUFXLFVBQVUsR0FBRztBQUMxQixrQkFBTSxhQUNKLFFBQVEsSUFBSSx3QkFBd0IsV0FDaEMsS0FBSyxXQUFXLFVBQVUsVUFBVSxVQUFVLElBQzlDLFFBQVEsSUFBSSx3QkFBd0IsWUFDbEMsS0FBSyxTQUFTLFVBQVUsSUFDeEIsS0FBSyxTQUFTLFVBQVUsVUFBVTtBQUMxQyxrQkFBTSxFQUFFLE1BQU0sSUFBSSxNQUFlLHFCQUFZO0FBQzdDLGdCQUFJLE9BQU87QUFDVCxvQkFBTSxRQUFRLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLFlBQVksUUFBUSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxLQUFLLFlBQVksUUFBUSxNQUFNLEdBQUcsR0FBRyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDdkosb0JBQU0sUUFBUTtBQUFBLGdCQUNaLE1BQU07QUFBQSxrQkFBSSxDQUFDLE1BQ1QsTUFBTSxZQUFZO0FBQUEsb0JBQ2hCLEtBQUssU0FBUyxZQUFZLENBQUMsRUFBRSxRQUFRLFNBQVMsRUFBRTtBQUFBLG9CQUNoRCxZQUFZLFNBQVMsWUFBWSxDQUFDO0FBQUEsb0JBQ2xDLFNBQVMsYUFBYSxHQUFHLE1BQU07QUFBQSxrQkFDakMsQ0FBQztBQUFBLGdCQUNIO0FBQUEsY0FDRjtBQUNBLG9CQUFNLE1BQU0sV0FBVyxFQUFFLFdBQVcsQ0FBQztBQUFBLFlBQ3ZDO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
