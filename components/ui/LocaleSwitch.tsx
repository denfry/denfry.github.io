'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

export function LocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const other = locale === 'en' ? 'ru' : 'en'
  return (
    <button
      type="button"
      aria-label="Switch language"
      onClick={() => router.replace(pathname, { locale: other })}
    >
      {other.toUpperCase()}
    </button>
  )
}
