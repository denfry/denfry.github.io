import { usePrefs } from '../../context/PrefsContext'
import { STRINGS } from '../../i18n'
import { PROJECTS } from '../../content'
import { WorkItem } from './WorkItem'

export function Work() {
  const { lang } = usePrefs()
  return (
    <section className="section">
      <h2 className="gutterLabel">{STRINGS[lang].selectedWork}</h2>
      <ol>
        {PROJECTS.map((project, i) => (
          <WorkItem key={project.name} project={project} index={i + 1} lang={lang} delay={i * 0.06} />
        ))}
      </ol>
    </section>
  )
}
