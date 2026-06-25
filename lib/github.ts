import fallback from './github-fallback.json'
import { FEATURED } from './projects'

export type Repo = {
  name: string
  url: string
  description: string | null
  language: string | null
  stars: number
}

type ApiRepo = {
  name: string
  fork: boolean
  archived: boolean
  stargazers_count: number
  html_url: string
  description: string | null
  language: string | null
}

export function filterAndSort(repos: ApiRepo[], featured: Set<string>): Repo[] {
  return repos
    .filter((r) => !r.fork && !r.archived && !featured.has(r.name))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
    }))
}

export async function getMoreRepos(): Promise<Repo[]> {
  const featured = new Set(FEATURED.map((p) => p.name))
  try {
    const res = await fetch(
      'https://api.github.com/users/denfry/repos?per_page=100&sort=updated',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 86_400 },
      },
    )
    if (!res.ok) throw new Error(`GitHub ${res.status}`)
    return filterAndSort(await res.json(), featured)
  } catch {
    return filterAndSort(fallback as ApiRepo[], featured)
  }
}
