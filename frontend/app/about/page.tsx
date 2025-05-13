"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { FadeInWhenVisible } from "@/components/animations/fade-in-when-visible"
import { StaggeredChildren, StaggeredChild } from "@/components/animations/staggered-container"
import { TextReveal } from "@/components/animations/text-reveal"
import { ParallaxSection } from "@/components/animations/parallax-section"
import { ScrollProgressIndicator } from "@/components/animations/scroll-progress-indicator"
import { FloatingElement } from "@/components/animations/floating-element"


export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 overflow-hidden">
      {/* Progress bar */}
      <ScrollProgressIndicator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <FadeInWhenVisible>
          <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center leading-tight text-black mt-10">
            <div className=" mb-2">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                About Rozgaar
              </motion.div>
            </div>
            
          </h1>
            <TextReveal text={<h2 className="text-3xl font-bold mb-6">Pakistan's Premier Freelance Marketplace</h2>} />
            <motion.p
              className="text-lg text-gray-700 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Rozgaar was founded with a clear mission: to connect Pakistan's talented professionals with clients
              seeking quality services, all while keeping economic value within our borders.
            </motion.p>
            <motion.p
              className="text-lg text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              As Pakistan's first locally developed freelance platform, we're proud to offer a space where skills are
              valued, opportunities are created, and careers are built.
            </motion.p>
          </div>
        </FadeInWhenVisible>

        <ParallaxSection baseVelocity={0.05}>
          <FadeInWhenVisible delay={0.2}>            <motion.div
              className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Image
                src="/about-img.png"
                alt="Pakistani freelancers working"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </motion.div>
          </FadeInWhenVisible>
        </ParallaxSection>
      </div>

      <FadeInWhenVisible>
        <TextReveal text={<h2 className="text-3xl font-bold text-center mb-12">Why Rozgaar Leads in Pakistan</h2>} />
      </FadeInWhenVisible>

      <StaggeredChildren
        staggerDelay={0.15}
        containerDelay={0.2}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
      >
        <StaggeredChild>
          <FloatingElement amount={10} speed={0.5}>
            <motion.div
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                borderColor: "rgba(0,0,0,0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-full mb-4 text-xl font-bold"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                1
              </motion.div>
              <h3 className="text-xl font-bold mb-4">Local Focus, Global Standards</h3>
              <p className="text-gray-700">
                Unlike international platforms, Rozgaar is built specifically for Pakistan's unique market needs, while
                maintaining world-class quality and service standards.
              </p>
            </motion.div>
          </FloatingElement>
        </StaggeredChild>

        <StaggeredChild>
          <FloatingElement amount={10} speed={0.5}>
            <motion.div
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                borderColor: "rgba(0,0,0,0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-full mb-4 text-xl font-bold"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                2
              </motion.div>
              <h3 className="text-xl font-bold mb-4">Zero Foreign Currency Fees</h3>
              <p className="text-gray-700">
                By keeping transactions in local currency, we eliminate foreign exchange fees and banking complications
                that eat into freelancers' earnings on other platforms.
              </p>
            </motion.div>
          </FloatingElement>
        </StaggeredChild>

        <StaggeredChild>
          <FloatingElement amount={10} speed={0.5}>
            <motion.div
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                borderColor: "rgba(0,0,0,0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-full mb-4 text-xl font-bold"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                3
              </motion.div>
              <h3 className="text-xl font-bold mb-4">Local Payment Solutions</h3>
              <p className="text-gray-700">
                With seamless integration to Pakistani banks and mobile payment systems, getting paid has never been
                easier for local freelancers.
              </p>
            </motion.div>
          </FloatingElement>
        </StaggeredChild>
      </StaggeredChildren>

      <ParallaxSection baseVelocity={-0.05}>
        <motion.div
          className="bg-gray-50 p-8 md:p-16 rounded-lg mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <FadeInWhenVisible>
             <h1 className="text-2xl md:text-3xl font-bold mb-12 text-center leading-tight text-black mt-10">
            <div className=" mb-2">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Our Vision for Pakistan
              </motion.div>
            </div>
            
          </h1>
          <motion.p
              className="text-lg text-center text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Rozgaar aims to be the driving force behind Pakistan's digital economy growth, helping to reduce brain
              drain by creating sustainable local opportunities. We believe in the incredible talent of our nation and
              work tirelessly to showcase it while building economic resilience through digital self-reliance.
            </motion.p>
          </FadeInWhenVisible>
        </motion.div>
      </ParallaxSection>

      
    </div>
  )
}
