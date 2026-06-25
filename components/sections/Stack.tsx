import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'

const LANGUAGES = [
  'Java',
  'Python',
  'Go',
  'Rust',
  'C#',
  'Flutter',
  'PowerShell',
]

export function Stack() {
  const t = useTranslations('stack')

  return (
    <section id="stack" className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand">
        {t('label')}
      </p>
      <p className="mt-6 max-w-prose text-lg text-muted-foreground leading-relaxed">
        {t('text')}
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <Badge key={lang} variant="secondary">
            {lang}
          </Badge>
        ))}
      </div>
    </section>
  )
}
