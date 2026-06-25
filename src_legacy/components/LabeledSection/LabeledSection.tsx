import { Reveal } from '../Reveal/Reveal'
import styles from './LabeledSection.module.css'

export function LabeledSection({ label, text }: { label: string; text: string }) {
  return (
    <section className="section">
      <h2 className="gutterLabel">{label}</h2>
      <Reveal>
        <p className={styles.text}>{text}</p>
      </Reveal>
    </section>
  )
}
