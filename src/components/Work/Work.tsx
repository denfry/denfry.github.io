import { usePrefs } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import { PROJECTS } from '../../content'
import { WorkItem } from './WorkItem'
import styles from './Work.module.css'

export function Work() {
  const { lang } = usePrefs()
  const t = STRINGS[lang]
  const clientProjects = PROJECTS.filter((p) => p.role === 'client')
  const personalProjects = PROJECTS.filter((p) => p.role === 'personal')

  return (
    <section className="section">
      <h2 className="gutterLabel">{t.selectedWork}</h2>
      <div>
        <h3 className={styles.groupLabel}>{t.workClientLabel}</h3>
        <ol>
          {clientProjects.map((project, i) => (
            <WorkItem key={project.name} project={project} index={i + 1} lang={lang} delay={i * 0.06} />
          ))}
        </ol>
        <h3 className={styles.groupLabel}>{t.workPersonalLabel}</h3>
        <ol>
          {personalProjects.map((project, i) => (
            <WorkItem key={project.name} project={project} index={i + 1} lang={lang} delay={i * 0.06} />
          ))}
        </ol>
      </div>
    </section>
  )
}
