import { useTranslations } from 'next-intl'
import { LocaleSwitch } from '@/components/ui/LocaleSwitch'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Link } from '@/i18n/navigation'
import { CONTACTS } from '@/lib/contacts'

export function Header() {
  const t = useTranslations('nav')
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-bold text-brand">
          Denfry
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/#projects" className="text-sm">
            {t('projects')}
          </Link>
          <a
            href={CONTACTS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            {t('github')}
          </a>
          <a
            href={CONTACTS.orderTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground"
          >
            {t('order')}
          </a>
          <ThemeToggle />
          <LocaleSwitch />
        </nav>
      </div>
    </header>
  )
}
