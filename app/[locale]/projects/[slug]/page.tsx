import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { projects } from '@/.velite'
import { JsonLd } from '@/components/JsonLd'
import { MDXContent } from '@/components/MDXContent'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'

export function generateStaticParams() {
  return projects.flatMap((project) =>
    routing.locales.map((locale) => ({ locale, slug: project.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const caseStudy = projects.find((p) => p.slug === slug)
  if (!caseStudy) return {}

  const canonical = `${SITE_URL}/${locale}/projects/${slug}`

  return {
    title: caseStudy.title,
    description: caseStudy.summary,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en/projects/${slug}`,
        ru: `${SITE_URL}/ru/projects/${slug}`,
      },
    },
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.summary,
      locale,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: caseStudy.title,
      description: caseStudy.summary,
    },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations('projects')
  const caseStudy = projects.find((p) => p.slug === slug)
  if (!caseStudy) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        type="SoftwareSourceCode"
        name={caseStudy.title}
        description={caseStudy.summary}
        codeRepository={caseStudy.repo}
      />

      <Link
        href="/#projects"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors"
      >
        ← {t('back')}
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
