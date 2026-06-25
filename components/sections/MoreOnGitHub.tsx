import { getTranslations } from 'next-intl/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CONTACTS } from '@/lib/contacts'
import { getMoreRepos } from '@/lib/github'

export async function MoreOnGitHub() {
  const repos = (await getMoreRepos()).filter((r) => r.description).slice(0, 9)
  const t = await getTranslations('projects')

  return (
    <section
      aria-label="More repositories"
      className="mx-auto max-w-5xl px-6 py-24"
    >
      <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand">
        {t('more')}
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <li key={repo.name}>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={repo.name}
              className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-xl"
            >
              <Card
                size="sm"
                className="h-full transition-colors hover:border-brand/60 hover:ring-brand/30"
              >
                <CardHeader>
                  <CardTitle className="font-heading text-sm text-foreground group-hover:text-brand transition-colors">
                    {repo.name}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {repo.language && (
                      <Badge variant="secondary" className="text-xs">
                        {repo.language}
                      </Badge>
                    )}
                    {repo.stars > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ★ {repo.stars}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {repo.description}
                  </p>
                </CardContent>
              </Card>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-right">
        <a
          href={CONTACTS.allRepos}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brand hover:underline underline-offset-4"
        >
          {t('allRepos')}
        </a>
      </div>
    </section>
  )
}
