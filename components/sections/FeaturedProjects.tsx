import { useTranslations } from 'next-intl'
import { ProjectCard } from '@/components/ProjectCard'
import { FEATURED } from '@/lib/projects'

export function FeaturedProjects() {
  const t = useTranslations('projects')

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand">
        {t('selected')}
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
