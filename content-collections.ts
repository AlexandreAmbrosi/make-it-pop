import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
// @ts-ignore
import toc from 'markdown-toc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExpressiveCode from 'rehype-expressive-code'
import rehypeSlug from 'rehype-slug'

const blogs = defineCollection({
  name: 'blog',
  include: '**/*.md',
  directory: 'content/blog',
  schema: (z) => ({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    head_image: z.string().url(),
    published: z.boolean().optional(),
    show_author: z.boolean().optional(),
    blog_image: z.string().url().optional().default('https://ik.imagekit.io/vjeqenuhn/launchfast-website/general'),
    created_at: z.string().transform((date) => new Date(date)),
  }),
  transform: async (document, context) => {
    const [tmp, mdx, tableOfContents] = await Promise.all([
      context.collection.documents(),
      compileMarkdown(context, document, {
        rehypePlugins: [[rehypeExpressiveCode, {}], rehypeAutolinkHeadings, rehypeSlug],
      }),
      toc(document.content).json.filter((i: { lvl: number }) => i.lvl === 2),
    ])
    const idx = tmp.findIndex((d) => document._meta.filePath === d._meta.filePath)
    return {
      ...document,
      tableOfContents,
      mdx: mdx.toString(),
      prev: idx > 0 ? tmp[idx - 1] : null,
      next: idx < tmp.length - 1 ? tmp[idx + 1] : null,
    }
  },
})

const docs = defineCollection({
  name: 'docs',
  include: '**/*.md',
  directory: 'content/docs',
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    published: z.boolean().optional(),
    created_at: z.string().transform((date) => new Date(date)),
  }),
  transform: async (document, context) => {
    const [tmp, mdx, tableOfContents] = await Promise.all([
      context.collection.documents(),
      compileMarkdown(context, document, {
        rehypePlugins: [[rehypeExpressiveCode, {}], rehypeAutolinkHeadings, rehypeSlug],
      }),
      toc(document.content).json.filter((i: { lvl: number }) => i.lvl === 2),
    ])
    const idx = tmp.findIndex((d) => document._meta.filePath === d._meta.filePath)
    return {
      ...document,
      tableOfContents,
      mdx: mdx.toString(),
      prev: idx > 0 ? tmp[idx - 1] : null,
      next: idx < tmp.length - 1 ? tmp[idx + 1] : null,
    }
  },
})

export default defineConfig({ collections: [blogs, docs] })
