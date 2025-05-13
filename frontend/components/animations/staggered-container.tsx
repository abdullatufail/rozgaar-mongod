"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface StaggeredChildrenProps {
  children: ReactNode
  staggerDelay?: number
  containerDelay?: number
  className?: string
}

export const StaggeredChildren = ({
  children,
  staggerDelay = 0.1,
  containerDelay = 0,
  className = "",
}: StaggeredChildrenProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: containerDelay,
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredChildProps {
  children: ReactNode
  customVariants?: any
  className?: string
}

export const StaggeredChild = ({ children, customVariants, className = "" }: StaggeredChildProps) => {
  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const variants = customVariants || defaultVariants

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
