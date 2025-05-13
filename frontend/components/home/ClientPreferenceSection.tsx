"use client"

import { motion } from "framer-motion"
import { ParallaxSection } from "../animations/parallax-section"
import { StaggeredChildren, StaggeredChild } from "../animations/staggered-container"

export function ClientPreferenceSection() {
  return (
    <ParallaxSection baseVelocity={-0.1}>
      <motion.section
        className="bg-black text-white px-10 py-16 md:py-24 m-5 md:m-10 rounded-xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center mb-12 md:mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 md:mb-0 md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Why clients prefer rozgaar
            </motion.h2>
            <motion.p
              className="md:w-1/2 text-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Rozgaar is designed to empower freelancers and businesses in Pakistan with a seamless, reliable, and
              growth-driven platform.
            </motion.p>
          </div>

          <StaggeredChildren staggerDelay={0.15} containerDelay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StaggeredChild
                customVariants={{
                  hidden: { opacity: 0, y: 50 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    },
                  },
                }}
              >
                <motion.div
                  className="bg-black border border-gray-800 rounded-lg p-8"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 30px -15px rgba(255,255,255,0.2)",
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <h3 className="text-2xl font-bold mb-6">Trusted by Thousands</h3>
                  <p className="text-gray-400">
                    Join a thriving community of skilled freelancers and reputable clients.
                  </p>
                </motion.div>
              </StaggeredChild>

              <StaggeredChild
                customVariants={{
                  hidden: { opacity: 0, y: 50 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    },
                  },
                }}
              >
                <motion.div
                  className="bg-black border border-gray-800 rounded-lg p-8"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 30px -15px rgba(255,255,255,0.2)",
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <h3 className="text-2xl font-bold mb-6">Local Payment Solutions</h3>
                  <p className="text-gray-400">
                    Enjoy fast, hassle-free payments with methods tailored for Pakistan.
                  </p>
                </motion.div>
              </StaggeredChild>

              <StaggeredChild
                customVariants={{
                  hidden: { opacity: 0, y: 50 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    },
                  },
                }}
              >
                <motion.div
                  className="bg-black border border-gray-800 rounded-lg p-8"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 30px -15px rgba(255,255,255,0.2)",
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <h3 className="text-2xl font-bold mb-6">24/7 Customer Support</h3>
                  <p className="text-gray-400">We're here to help whenever you need it.</p>
                </motion.div>
              </StaggeredChild>
            </div>
          </StaggeredChildren>
        </div>
      </motion.section>
    </ParallaxSection>
  )
}
