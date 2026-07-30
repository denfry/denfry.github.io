import { motion, useReducedMotion } from 'framer-motion'
import { type Project } from '../../content'
import { type Lang } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import styles from './Work.module.css'

export function WorkItem({
  project,
  index,
  lang,
  delay = 0,
}: {
  project: Project
  index: number
  lang: Lang
  delay?: number
}) {
  const reduce = useReducedMotion()
  const t = STRINGS[lang]
  const num = String(index).padStart(2, '0')
  const link = project.liveUrl
    ? { href: project.liveUrl, label: t.viewSite }
    : project.codeUrl
      ? { href: project.codeUrl, label: t.viewCode }
      : null

  return (
    <motion.li
      className={styles.item}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
    >
      <span className={styles.num}>{num}</span>
      <div>
        {project.image && (
          <img
            className={styles.image}
            src={project.image}
            alt=""
            loading="lazy"
            width={1600}
            height={900}
          />
        )}
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.desc}>{project.desc[lang]}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {link && (
          <a className={styles.link} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        )}
      </div>
    </motion.li>
  )
}
