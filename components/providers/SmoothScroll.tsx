'use client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update()
  })
  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Start false to match SSR (window is undefined on server → no reduced motion).
  // After hydration, read the real preference and subscribe to changes.
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (reduced) {
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
