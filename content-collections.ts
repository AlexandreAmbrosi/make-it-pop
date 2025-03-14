import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
// @ts-ignore
import markdownToc from 'markdown-toc'
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
    const [tmp, mdx] = await Promise.all([
      context.collection.documents(),
      compileMarkdown(context, document, {
        rehypePlugins: [[rehypeExpressiveCode, {}], rehypeAutolinkHeadings, rehypeSlug],
      }),
    ])
    const idx = tmp.findIndex((d) => document._meta.filePath === d._meta.filePath)
    return {
      ...document,
      mdx: mdx.toString(),
      prev: idx > 0 ? tmp[idx - 1] : null,
      next: idx < tmp.length - 1 ? tmp[idx + 1] : null,
    }
  },
})

const changelog = defineCollection({
  name: 'changelog',
  include: '**/*.md',
  directory: 'content/changelog',
  schema: (z) => ({}),
  transform: async (document, context) => {
    const mdx = await compileMarkdown(context, document, {
      rehypePlugins: [[rehypeExpressiveCode, {}], rehypeAutolinkHeadings, rehypeSlug],
    })
    return {
      ...document,
      mdx: mdx.toString(),
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
    const [tmp, mdx] = await Promise.all([
      context.collection.documents(),
      compileMarkdown(context, document, {
        rehypePlugins: [[rehypeExpressiveCode, {}], rehypeAutolinkHeadings, rehypeSlug],
      }),
    ])
    const idx = tmp.findIndex((d) => document._meta.filePath === d._meta.filePath)
    return {
      ...document,
      mdx: mdx.toString(),
      prev: idx > 0 ? tmp[idx - 1] : null,
      next: idx < tmp.length - 1 ? tmp[idx + 1] : null,
      toc: (markdownToc(document.content).json as { lvl: number; content: string; slug: string }[])
        .filter((i) => i.lvl === 2)
        .map((i) => ({ content: i.content, slug: '#' + i.slug })),
    }
  },
})

export default defineConfig({ collections: [blogs, docs, changelog] })
