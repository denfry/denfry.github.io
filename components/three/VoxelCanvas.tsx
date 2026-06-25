'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { CanvasFallback } from './CanvasFallback'
import { SceneErrorBoundary } from './SceneErrorBoundary'

/**
 * Lazy-load VoxelScene on the client only (ssr: false).
 * Shows CanvasFallback while the bundle loads.
 */
const VoxelScene = dynamic(
  () => import('./VoxelScene').then((m) => m.VoxelScene),
  { ssr: false, loading: () => <CanvasFallback /> },
)

/**
 * VoxelCanvas — client component that:
 * 1. Defers prefers-reduced-motion check to after mount (avoids SSR/hydration mismatch).
 * 2. Renders CanvasFallback when reduced motion is requested.
 * 3. Wraps VoxelScene in SceneErrorBoundary so WebGL failures degrade gracefully.
 */
export function VoxelCanvas() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (reduced) return <CanvasFallback />

  return (
    <SceneErrorBoundary>
      <VoxelScene />
    </SceneErrorBoundary>
  )
}
