"use client"

import type React from "react"

import { motion } from "framer-motion"

interface TextRevealProps {
  text: string | React.ReactNode
  delay?: number
  duration?: number
}

export const TextReveal = ({ text, delay = 0, duration = 0.8 }: TextRevealProps) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        viewport={{ once: true }}
      >
        {text}
      </motion.div>
    </div>
  )
}
