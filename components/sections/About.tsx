import { useTranslations } from 'next-intl'

export function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-heading text-xs font-semibold uppercase tracking-widest text-brand">
        {t('label')}
      </p>
      <p className="mt-6 max-w-prose text-lg text-muted-foreground leading-relaxed">
        {t('text')}
      </p>
    </section>
  )
}
