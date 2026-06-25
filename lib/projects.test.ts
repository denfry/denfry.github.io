import { describe, expect, it } from 'vitest'
import { FEATURED } from './projects'

describe('FEATURED', () => {
  it('has the 7 featured projects with slugs and urls', () => {
    expect(FEATURED).toHaveLength(7)
    expect(FEATURED.map((p) => p.name)).toContain('codebase-index')
    for (const p of FEATURED) {
      expect(p.url).toMatch(/^https:\/\/github\.com\/denfry\//)
      expect(p.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })
})
