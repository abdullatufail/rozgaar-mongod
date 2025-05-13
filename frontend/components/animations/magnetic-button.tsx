"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, useSpring } from "framer-motion"

interface MagneticButtonProps {
  children: React.ReactNode
  strength?: number
}

export const MagneticButton = ({ children, strength = 50 }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    if (!buttonRef.current) return

    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()

    const x = (clientX - (left + width / 2)) / strength
    const y = (clientY - (top + height / 2)) / strength

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const springConfig = { stiffness: 150, damping: 15 }
  const xMotion = useSpring(position.x, springConfig)
  const yMotion = useSpring(position.y, springConfig)

  useEffect(() => {
    xMotion.set(position.x)
    yMotion.set(position.y)
  }, [position, xMotion, yMotion])

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xMotion, y: yMotion }}
    >
      {children}
    </motion.div>
  )
}
