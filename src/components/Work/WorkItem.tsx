import { motion, useReducedMotion } from 'framer-motion'
import { type Project } from '../../content'
import { type Lang } from '../../context/PrefsContext'
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
  const num = String(index).padStart(2, '0')
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
        <a className={styles.name} href={project.url}>{project.name}</a>
        <p className={styles.desc}>{project.desc[lang]}</p>
        <p className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>
      </div>
    </motion.li>
  )
}
