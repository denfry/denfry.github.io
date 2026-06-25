'use client'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { VoxelField } from './VoxelField'

/**
 * VoxelScene — the R3F <Canvas> shell.
 * This is the file that VoxelCanvas dynamically imports (ssr: false).
 * Camera pulled back to frame the 8×8×8 voxel chunk; fog adds depth.
 *
 * Postprocessing:
 * - Bloom: subtle glow on the brightest voxel faces (luminanceThreshold=0.85
 *   ensures only specular highlights bloom, not the whole mesh). Low intensity
 *   keeps it tasteful — a gentle halo rather than a blown-out effect.
 * - Vignette: soft edge darkening for depth / cinematic framing.
 */
export function VoxelScene() {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 16], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <fog attach="fog" args={['#0d1117', 20, 38]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 10, 6]} intensity={1.4} />
      <directionalLight
        position={[-6, -4, -6]}
        intensity={0.3}
        color="#3FB950"
      />
      <VoxelField count={512} />
      <EffectComposer>
        {/* Subtle bloom: only specular/bright highlights glow */}
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.1}
          height={300}
        />
        {/* Soft vignette for depth + cinematic framing */}
        <Vignette eskil={false} offset={0.3} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  )
}
