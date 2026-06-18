import { usePrefs } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import { CONTACTS } from '../../content'
import { LangToggle } from '../controls/LangToggle'
import { ThemeToggle } from '../controls/ThemeToggle'
import styles from './Header.module.css'

export function Header() {
  const { lang } = usePrefs()
  return (
    <header className={styles.head}>
      <div>
        <a className={styles.wordmark} href="/">DENFRY</a>
        <p className={styles.role}>{STRINGS[lang].role}</p>
      </div>
      <nav className={styles.nav}>
        <LangToggle />
        <ThemeToggle />
        <a className={styles.link} href={CONTACTS.telegram}>Telegram</a>
        <a className={styles.link} href={CONTACTS.github}>GitHub</a>
      </nav>
    </header>
  )
}
