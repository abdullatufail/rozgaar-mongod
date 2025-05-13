"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"

interface FadeInWhenVisibleProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  x?: number
  className?: string
}

export const FadeInWhenVisible = ({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  x = 0,
  className = "",
}: FadeInWhenVisibleProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
