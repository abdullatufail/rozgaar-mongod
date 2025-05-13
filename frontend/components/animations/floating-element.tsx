"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, useSpring } from "framer-motion"

interface FloatingElementProps {
  children: React.ReactNode
  amount?: number
  speed?: number
}

export const FloatingElement = ({ children, amount = 15, speed = 3 }: FloatingElementProps) => {
  const y = useSpring(0, {
    stiffness: 100,
    damping: 30,
  })

  useEffect(() => {
    let dir = 1
    let current = 0

    const interval = setInterval(() => {
      current += speed * dir
      if (Math.abs(current) > amount) {
        dir *= -1
      }
      y.set(current)
    }, 50)

    return () => clearInterval(interval)
  }, [y, amount, speed])

  return <motion.div style={{ y }}>{children}</motion.div>
}
