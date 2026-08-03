import { motion, useReducedMotion } from 'framer-motion'
import { type Project } from '../../content'
import { type Lang } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import styles from './Work.module.css'

function chromeLabel(project: Project): string | null {
  if (project.liveUrl) {
    try {
      return new URL(project.liveUrl).host
    } catch {
      return project.liveUrl
    }
  }
  if (project.codeUrl) {
    return project.codeUrl.replace(/^https?:\/\//, '')
  }
  return null
}

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
  const urlLabel = chromeLabel(project)
  const alt = project.alt ? project.alt[lang] : project.name
  const frameHref = project.liveUrl ?? project.codeUrl

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
        {project.image && frameHref && (
          <a
            className={styles.frame}
            href={frameHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.chrome}>
              <span className={styles.dots} aria-hidden="true">
                <i className={styles.dotRed} />
                <i className={styles.dotYellow} />
                <i className={styles.dotGreen} />
              </span>
              <span className={styles.url}>{urlLabel}</span>
            </span>
            <picture>
              <source
                type="image/webp"
                srcSet={`${project.image.replace(/\.png$/, '')}-800.webp 800w, ${project.image.replace(/\.png$/, '')}-1600.webp 1600w`}
                sizes="(max-width: 520px) 100vw, (max-width: 760px) 78vw, 640px"
              />
              <img
                className={styles.shot}
                src={project.image}
                srcSet={`${project.image} 1568w`}
                alt={alt}
                loading="lazy"
                decoding="async"
                width={project.width ?? 1568}
                height={project.height ?? 756}
              />
            </picture>
          </a>
        )}
        <h4 className={styles.name}>{project.name}</h4>
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
