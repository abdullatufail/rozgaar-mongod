"use client"

import { motion } from "framer-motion"
import { Info } from "lucide-react"
import { FadeInWhenVisible } from "../animations/fade-in-when-visible"
import { HeroSearchBar } from "./HeroSearchBar"

export function HeroSection() {

  return (
    <section className="container mx-auto px-8 md:px-4 py-16 md:py-28 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center leading-tight text-black">
            <div className="overflow-hidden mb-2">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Pakistan's fastest growing
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Freelance Platform
              </motion.div>
            </div>
          </h1>
        </motion.div>

        <FadeInWhenVisible delay={0.4}>
          <div className="mb-12 text-center">
            <p className="text-lg mb-6">
              Join Pakistan's fastest-growing freelancing platform.
              <br />
              Connect with clients, showcase your skills, and build the career you deserve.
            </p>
            <motion.div
              className="inline-flex items-center"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <Info className="h-5 w-5 text-gray-500 mr-2" />
            </motion.div>
          </div>
        </FadeInWhenVisible>        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
        >
          <div className="flex justify-center mb-8">
            <HeroSearchBar className="w-full max-w-xl mx-auto" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
