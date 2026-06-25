import { motion, useReducedMotion } from 'framer-motion'
import { usePrefs } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import styles from './Intro.module.css'

export function Intro() {
  const { lang } = usePrefs()
  const reduce = useReducedMotion()
  return (
    <section className="section">
      <div className="gutterLabel" aria-hidden="true" />
      <motion.p
        key={lang}
        className={styles.lead}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {STRINGS[lang].introLead}
      </motion.p>
    </section>
  )
}
