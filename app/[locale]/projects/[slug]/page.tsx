import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { projects } from '@/.velite'
import { MDXContent } from '@/components/MDXContent'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return projects.flatMap((project) =>
    routing.locales.map((locale) => ({ locale, slug: project.slug })),
  )
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const caseStudy = projects.find((p) => p.slug === slug)
  if (!caseStudy) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/#projects"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors"
      >
        ← Back to projects
      </Link>

      <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {caseStudy.title}
      </h1>

      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {caseStudy.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {caseStudy.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <a
        href={caseStudy.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline underline-offset-4"
      >
        View on GitHub →
      </a>

      <hr className="my-10 border-border" />

      <MDXContent code={caseStudy.body} />
    </article>
  )
}
