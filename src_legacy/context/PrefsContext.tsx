import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Lang = 'en' | 'ru'
export type Theme = 'light' | 'dark'

type Prefs = {
  lang: Lang
  theme: Theme
  toggleLang: () => void
  toggleTheme: () => void
}

const PrefsCtx = createContext<Prefs | null>(null)

function attr(name: string): string | null {
  return document.documentElement.getAttribute(name)
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (attr('data-lang') === 'ru' ? 'ru' : 'en'))
  const [theme, setTheme] = useState<Theme>(() => (attr('data-theme') === 'dark' ? 'dark' : 'light'))

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'en' ? 'ru' : 'en'
      const r = document.documentElement
      r.setAttribute('lang', next)
      r.setAttribute('data-lang', next)
      try { localStorage.setItem('lang', next) } catch { /* storage unavailable */ }
      return next
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', next)
      try { localStorage.setItem('theme', next) } catch { /* storage unavailable */ }
      return next
    })
  }, [])

  return (
    <PrefsCtx.Provider value={{ lang, theme, toggleLang, toggleTheme }}>
      {children}
    </PrefsCtx.Provider>
  )
}

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsCtx)
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider')
  return ctx
}
