import { usePrefs } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import { CONTACTS } from '../../content'
import styles from './Footer.module.css'

export function Footer() {
  const { lang } = usePrefs()
  const year = new Date().getFullYear()
  return (
    <footer className={styles.foot}>
      <div className={styles.links}>
        <a href={CONTACTS.telegram}>Telegram</a>
        <a href={CONTACTS.github}>GitHub</a>
        <a href={CONTACTS.allRepos}>{STRINGS[lang].allRepos}</a>
      </div>
      <p className={styles.colophon}>© {year} denfry</p>
    </footer>
  )
}
