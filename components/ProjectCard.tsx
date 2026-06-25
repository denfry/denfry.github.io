import { useLocale } from 'next-intl'
import { projects } from '@/.velite'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import type { Project } from '@/lib/projects'

const caseSlugs = new Set(projects.map((p) => p.slug))

export function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale() as 'en' | 'ru'

  const isInternal = caseSlugs.has(project.slug)

  const cardBody = (
    <Card className="h-full transition-colors hover:border-brand/60 hover:ring-brand/30">
      <CardHeader>
        <CardTitle className="font-heading text-foreground group-hover:text-brand transition-colors">
          {project.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{project.desc[locale]}</CardDescription>
      </CardContent>
      <CardFooter className="flex-wrap gap-1.5 border-none bg-transparent">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )

  if (isInternal) {
    return (
      <Link
        href={`/projects/${project.slug}`}
        aria-label={project.name}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-xl"
      >
        {cardBody}
      </Link>
    )
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={project.name}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-xl"
    >
      {cardBody}
    </a>
  )
}
