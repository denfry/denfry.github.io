'use client'
import { Canvas } from '@react-three/fiber'
import { VoxelField } from './VoxelField'

/**
 * VoxelScene — the R3F <Canvas> shell.
 * This is the file that VoxelCanvas dynamically imports (ssr: false).
 * Camera pulled back to frame the 8×8×8 voxel chunk; fog adds depth.
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
    </Canvas>
  )
}
