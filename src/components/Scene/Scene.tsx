import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import { TerrainMesh } from './TerrainMesh'
import { supportsWebGL } from './supportsWebGL'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import styles from './Scene.module.css'

export function Scene() {
  const reduced = useReducedMotion()
  const scrollProgress = useScrollProgress()
  const [webglOk] = useState(() => supportsWebGL())
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    function onVisibility() {
      setHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (!webglOk) {
    return <div className={styles.fallback} aria-hidden="true" />
  }

  return (
    <div className={styles.stage} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2.4, 6], fov: 45 }}
        frameloop={hidden ? 'never' : reduced ? 'demand' : 'always'}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <TerrainMesh reduced={!!reduced} scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  )
}
