import { usePrefs } from '../../context/PrefsContext'
import styles from './controls.module.css'

export function LangToggle() {
  const { lang, toggleLang } = usePrefs()
  return (
    <button className={styles.ctl} type="button" onClick={toggleLang} aria-label="Toggle language">
      <span className={lang === 'en' ? styles.active : undefined}>EN</span>
      {' / '}
      <span className={lang === 'ru' ? styles.active : undefined}>RU</span>
    </button>
  )
}
