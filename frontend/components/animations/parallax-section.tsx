"use client"

import type { ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: ReactNode
  baseVelocity?: number
  inputRange?: [number, number]
  outputRange?: [number, number]
}

export const ParallaxSection = ({
  children,
  baseVelocity = 0.05,
  inputRange = [0, 1000],
  outputRange = [0, 300],
}: ParallaxSectionProps) => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, inputRange, [0, outputRange[1] * baseVelocity])

  return <motion.div style={{ y }}>{children}</motion.div>
}
