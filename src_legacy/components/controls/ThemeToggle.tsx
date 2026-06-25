import { usePrefs } from '../../context/PrefsContext'
import styles from './controls.module.css'

export function ThemeToggle() {
  const { theme, toggleTheme } = usePrefs()
  return (
    <button
      className={styles.ctl}
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      aria-pressed={theme === 'dark'}
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
