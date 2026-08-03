import { useScrollProgress } from '../../hooks/useScrollProgress'
import styles from './ScrollProgress.module.css'

export function ScrollProgress() {
  const progress = useScrollProgress()
  return (
    <div className={styles.bar} aria-hidden="true">
      <div className={styles.fill} style={{ width: `${progress * 100}%` }} />
    </div>
  )
}
