'use client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update()
  })
  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Detect reduced-motion preference on the client
  // useEffect to avoid SSR mismatch
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) {
      // Refresh ScrollTrigger without Lenis so GSAP still works
      ScrollTrigger.refresh()
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    // No smooth scroll — render children with native scroll
    return <>{children}</>
  }

  return (
    <ReactLenis root options={{ autoRaf: true }}>
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
