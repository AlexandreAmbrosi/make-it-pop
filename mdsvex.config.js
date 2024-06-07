import { defineMDSveXConfig as defineConfig } from 'mdsvex'
import highlighter from './highlighter.mjs'

export default defineConfig({
  highlight: { highlighter },
  extensions: ['.svelte.md', '.md', '.svx'],
})
