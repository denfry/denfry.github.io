'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

/**
 * RotatingCube — placeholder mesh. Tasks 19/20 replace this with the instanced voxel field.
 */
function RotatingCube() {
  const meshRef = useRef<Mesh>(null)

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4
      meshRef.current.rotation.y += delta * 0.6
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial
        color="oklch(0.72 0.19 145)"
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}

/**
 * VoxelScene — the R3F <Canvas> shell.
 * This is the file that VoxelCanvas dynamically imports (ssr: false).
 * Tasks 19 and 20 will replace RotatingCube with the instanced voxel morph.
 */
export function VoxelScene() {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <RotatingCube />
    </Canvas>
  )
}
