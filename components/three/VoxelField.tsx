'use client'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/**
 * VoxelField — instanced mesh of `count` unit cubes that assemble from scattered
 * positions into a voxel "chunk" shape on mount, then float + rotate subtly.
 *
 * Design intent: a slightly-rotated isometric chunk cube — a 3D grid of voxels
 * with edge/corner emphasis (hollow interior) for an elegant, lightweight look.
 * Brand green accent (#3FB950 ≈ oklch(0.72 0.19 145)) with subtle hue variation.
 *
 * Performance:
 * - Single reused THREE.Object3D dummy + THREE.Matrix4 for matrix composition.
 * - Positions precomputed once via useMemo (no per-frame allocation).
 * - GSAP progress value animated once on mount, then drives lerp in useFrame.
 * - Geometry/material disposed on unmount.
 */

/** Base x-tilt angle for isometric/oblique appearance; idle bob offsets from this. */
const BASE_TILT_X = Math.PI / 8

interface VoxelFieldProps {
  count?: number
}

/** Seeded pseudo-random (mulberry32) — deterministic, no Math.random in render. */
function mulberry32(seed: number) {
  let s = seed
  return () => {
    s += 0x6d2b79f5
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Build a set of "home" voxel positions forming an isometric-style chunk.
 * Grid is GRID×GRID×GRID with interior hollowed out, so only the shell survives.
 * Returns Float32Array of [x,y,z] triplets, capped to `maxCount`.
 */
function buildHomePositions(maxCount: number): Float32Array {
  const GRID = 8 // 8×8×8 grid → 8^3=512 cells, shell ~ 296 voxels
  const GAP = 1.05 // slight gap between cubes
  const positions: number[] = []

  for (let x = 0; x < GRID; x++) {
    for (let y = 0; y < GRID; y++) {
      for (let z = 0; z < GRID; z++) {
        // Shell: include only if on the edge in at least one axis
        const onEdge =
          x === 0 ||
          x === GRID - 1 ||
          y === 0 ||
          y === GRID - 1 ||
          z === 0 ||
          z === GRID - 1
        if (!onEdge) continue

        const px = (x - (GRID - 1) / 2) * GAP
        const py = (y - (GRID - 1) / 2) * GAP
        const pz = (z - (GRID - 1) / 2) * GAP
        positions.push(px, py, pz)

        if (positions.length / 3 >= maxCount) break
      }
      if (positions.length / 3 >= maxCount) break
    }
    if (positions.length / 3 >= maxCount) break
  }

  // Pad to maxCount if shell has fewer voxels than count (stack extras at origin)
  while (positions.length / 3 < maxCount) {
    positions.push(0, 0, 0)
  }

  return new Float32Array(positions)
}

/**
 * Build scattered starting positions — deterministic via seeded PRNG,
 * spread ±20 units in all axes with bias toward sphere surface.
 */
function buildScatteredPositions(count: number, seed = 42): Float32Array {
  const rng = mulberry32(seed)
  const positions = new Float32Array(count * 3)
  const SPREAD = 18

  for (let i = 0; i < count; i++) {
    // Spherical distribution for organic scatter
    const theta = rng() * Math.PI * 2
    const phi = Math.acos(2 * rng() - 1)
    const r = SPREAD * (0.5 + rng() * 0.5)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

/**
 * Build per-instance colors: brand green with subtle hue/lightness variation.
 * All deterministic (seeded RNG).
 */
function buildInstanceColors(count: number, seed = 99): THREE.Color[] {
  const rng = mulberry32(seed)
  const colors: THREE.Color[] = []
  // Brand green: oklch(0.72 0.19 145) ≈ #3FB950 in sRGB
  const base = new THREE.Color('#3FB950')
  for (let i = 0; i < count; i++) {
    const v = rng()
    // Shift slightly toward cyan (lighter) or yellow-green (darker)
    const c = new THREE.Color()
    c.r = base.r * (0.85 + v * 0.3)
    c.g = base.g * (0.9 + rng() * 0.15)
    c.b = base.b * (0.85 + rng() * 0.3)
    colors.push(c)
  }
  return colors
}

export function VoxelField({ count = 512 }: VoxelFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // progress.value: 0 = scattered, 1 = assembled. Mutated by GSAP, read in useFrame.
  const progress = useRef({ value: 0 })
  // Whether assembly is complete — skip lerp after that to save work
  const assembled = useRef(false)

  // Precompute positions/colors once (stable, no per-frame allocs)
  const { home, scattered, colors } = useMemo(() => {
    const home = buildHomePositions(count)
    const scattered = buildScatteredPositions(count)
    const colors = buildInstanceColors(count)
    return { home, scattered, colors }
  }, [count])

  // Reusable dummy + matrix (created once, mutated per frame)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Geometry and material — disposed on unmount
  const geometry = useMemo(() => new THREE.BoxGeometry(0.9, 0.9, 0.9), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        metalness: 0.25,
        roughness: 0.45,
        vertexColors: true,
      }),
    [],
  )

  // Initialize instance colors and matrices, then kick off GSAP assembly animation
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    // Set initial colors
    for (let i = 0; i < count; i++) {
      mesh.setColorAt(i, colors[i])
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

    // Set initial scattered matrices so the mesh starts in the right position
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        scattered[i * 3],
        scattered[i * 3 + 1],
        scattered[i * 3 + 2],
      )
      dummy.scale.setScalar(1)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true

    // GSAP timeline: scattered → home over 1.2s with power3.out easing
    const tl = gsap.timeline({ delay: 0.15 })
    tl.to(progress.current, {
      value: 1,
      duration: 1.2,
      ease: 'power3.out',
      onComplete: () => {
        assembled.current = true
      },
    })

    return () => {
      tl.kill()
    }
  }, [count, colors, scattered, dummy])

  // Dispose geometry + material on unmount
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  // useFrame: lerp instances scattered→home while assembling; then idle float
  useFrame((state, delta) => {
    const mesh = meshRef.current
    const group = groupRef.current
    if (!mesh || !group) return

    const p = progress.current.value

    if (!assembled.current) {
      // Assembly phase: lerp each instance from scattered to home
      for (let i = 0; i < count; i++) {
        const hx = home[i * 3]
        const hy = home[i * 3 + 1]
        const hz = home[i * 3 + 2]
        const sx = scattered[i * 3]
        const sy = scattered[i * 3 + 1]
        const sz = scattered[i * 3 + 2]

        dummy.position.set(
          sx + (hx - sx) * p,
          sy + (hy - sy) * p,
          sz + (hz - sz) * p,
        )
        dummy.scale.setScalar(1)
        dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }

    // Subtle continuous idle: slow rotation + gentle bob on the group
    const t = state.clock.elapsedTime
    group.rotation.y += delta * 0.08
    group.rotation.x = BASE_TILT_X + Math.sin(t * 0.3) * 0.04
    group.position.y = Math.sin(t * 0.4) * 0.08
  })

  return (
    <group
      ref={groupRef}
      // Slight initial tilt for the iso chunk look
      rotation={[Math.PI / 8, Math.PI / 6, 0]}
    >
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
    </group>
  )
}
