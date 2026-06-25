import { describe, expect, it } from 'vitest'
import { filterAndSort } from './github'

const sample = [
  {
    name: 'codebase-index',
    fork: false,
    archived: false,
    stargazers_count: 4,
    html_url: 'u',
    description: 'd',
    language: 'Python',
  },
  {
    name: 'panel',
    fork: true,
    archived: false,
    stargazers_count: 0,
    html_url: 'u',
    description: null,
    language: null,
  },
  {
    name: 'WindowsCleaner',
    fork: false,
    archived: false,
    stargazers_count: 0,
    html_url: 'u',
    description: 'd',
    language: 'PowerShell',
  },
]

describe('filterAndSort', () => {
  it('drops forks and featured, keeps the rest sorted by stars', () => {
    const out = filterAndSort(sample as never, new Set(['codebase-index']))
    expect(out.map((r) => r.name)).toEqual(['WindowsCleaner'])
  })
})
