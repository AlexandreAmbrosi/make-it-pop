import { defineCollection, defineConfig } from '@content-collections/core'
import rehypeExpressiveCode from 'rehype-expressive-code'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

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
    blog_image: z.string().url().optional(),
    created_at: z.string().transform((date) => new Date(date)),
  }),
  transform: async (document, context) => {
    const [docs, mdx] = await Promise.all([
      context.collection.documents(),
      unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).use(rehypeExpressiveCode).process(document.content),
    ])
    const idx = docs.findIndex((d) => document._meta.filePath === d._meta.filePath)
    return {
      ...document,
      mdx: mdx.toString(),
      prev: idx > 0 ? docs[idx - 1] : null,
      next: idx < docs.length - 1 ? docs[idx + 1] : null,
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
    const [docsCollection, mdx] = await Promise.all([
      context.collection.documents(),
      unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).use(rehypeExpressiveCode).process(document.content),
    ])
    const idx = docsCollection.findIndex((d) => document._meta.filePath === d._meta.filePath)
    return {
      ...document,
      mdx: mdx.toString(),
      prev: idx > 0 ? docsCollection[idx - 1] : null,
      next: idx < docsCollection.length - 1 ? docsCollection[idx + 1] : null,
    }
  },
})

export default defineConfig({
  collections: [blogs, docs],
})
