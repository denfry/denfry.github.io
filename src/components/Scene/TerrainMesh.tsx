import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function TerrainMesh({
  reduced,
  scrollProgress,
}: {
  reduced: boolean
  scrollProgress: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(24, 24, 48, 48)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z =
        (Math.sin(x * 0.35) + Math.cos(y * 0.4)) * 0.9 +
        Math.sin(x * 0.9 + y * 0.6) * 0.3
      pos.setZ(i, z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    // prefers-reduced-motion: freeze entirely — no dolly, no opacity easing,
    // no rotation, no parallax. The scene renders one static frame and stops.
    if (reduced) return

    // Camera dolly across scroll progress: close over hero (0), pulled back
    // and dimmer through Work (~0.4), near-static toward the footer (1).
    const targetZ = 6 + scrollProgress * 5
    camera.position.z += (targetZ - camera.position.z) * 0.08
    camera.lookAt(0, 0, 0)

    const material = meshRef.current.material as THREE.MeshBasicMaterial
    const targetOpacity = 0.35 - scrollProgress * 0.2
    material.opacity += (targetOpacity - material.opacity) * 0.08

    meshRef.current.rotation.z += delta * 0.03
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15

    // Pointer parallax
    const px = state.pointer.x * 0.3
    const py = state.pointer.y * 0.15
    meshRef.current.rotation.x += (-Math.PI / 2.6 + py - meshRef.current.rotation.x) * 0.04
    meshRef.current.rotation.y += (px - meshRef.current.rotation.y) * 0.04
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -1.5, 0]}>
      <meshBasicMaterial color="#8C86FF" wireframe transparent opacity={0.35} />
    </mesh>
  )
}
