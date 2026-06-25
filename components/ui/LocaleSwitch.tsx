'use client'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

export function LocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('a11y')
  const other = locale === 'en' ? 'ru' : 'en'
  return (
    <button
      type="button"
      aria-label={t('switchLanguage')}
      onClick={() => router.replace(pathname, { locale: other })}
    >
      {other.toUpperCase()}
    </button>
  )
}
