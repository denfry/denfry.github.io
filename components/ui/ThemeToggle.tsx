'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted)
    return <button type="button" aria-label="Toggle theme" className="size-9" />
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
    >
      {resolvedTheme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
