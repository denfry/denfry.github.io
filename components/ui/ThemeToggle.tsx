'use client'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('a11y')
  useEffect(() => setMounted(true), [])
  if (!mounted)
    return (
      <button type="button" aria-label={t('toggleTheme')} className="size-9" />
    )
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      aria-label={t('toggleTheme')}
      onClick={() => setTheme(next)}
    >
      {resolvedTheme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
