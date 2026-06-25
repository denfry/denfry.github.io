'use client'
import { motion, useReducedMotion } from 'motion/react'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Delay in seconds before the animation starts */
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    // Render children with no animation when reduced-motion is preferred
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
