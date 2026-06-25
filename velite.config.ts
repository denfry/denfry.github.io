import { defineCollection, defineConfig, s } from 'velite'

const projects = defineCollection({
  name: 'CaseStudy',
  pattern: 'projects/**/*.mdx',
  schema: s.object({
    slug: s.path().transform((p) => p.replace(/^projects\//, '')),
    title: s.string(),
    summary: s.string(),
    tags: s.array(s.string()),
    repo: s.string().url(),
    body: s.mdx(),
  }),
})

export default defineConfig({
  root: 'content',
  collections: { projects },
})
