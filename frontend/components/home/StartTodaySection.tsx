"use client"

import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { MagneticButton } from "../animations/magnetic-button"
import { StaggeredChildren, StaggeredChild } from "../animations/staggered-container"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function StartTodaySection() {
  return (
    <section className="py-16 px-8 md:px-4 bg-white my-10 md:mt-[50px] md:mb-[100px] overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Start Today
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Client Account */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            viewport={{ once: true }}
          >
            <Link href="/register?type=client" className="group">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className="flex items-center justify-between text-xl font-medium bg-black text-white rounded-md px-8 py-6 w-full mb-4 hover:bg-gray-800 relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-gray-700"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                  <span className="relative z-10">Client Account</span>
                  <motion.span
                    className="relative z-10"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Become a Client and hire freelancers for your projects
            </motion.p>
          </motion.div>

          {/* Seller Account */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            viewport={{ once: true }}
          >
            <Link href="/register?type=freelancer" className="group">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className="flex items-center justify-between text-xl font-medium bg-black text-white rounded-md px-8 py-6 w-full mb-4 hover:bg-gray-800 relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-gray-700"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                  <span className="relative z-10">Seller Account</span>
                  <motion.span
                    className="relative z-10"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Become a freelancer take up jobs and projects
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <StaggeredChildren staggerDelay={0.15} containerDelay={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            {/* No Cost to Join */}
            <StaggeredChild>
              <motion.div
                className="bg-white p-8 rounded-lg border border-gray-200"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                  borderColor: "rgba(0,0,0,0.2)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <h3 className="text-xl font-semibold mb-4">No Cost to Join</h3>
                <p className="text-gray-600">
                  Sign up for free, browse freelancer profiles, explore projects, or book a consultation at no
                  cost.
                </p>
              </motion.div>
            </StaggeredChild>

            {/* Post Jobs */}
            <StaggeredChild>
              <motion.div
                className="bg-white p-8 rounded-lg border border-gray-200"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                  borderColor: "rgba(0,0,0,0.2)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <h3 className="text-xl font-semibold mb-4">Post Jobs Effortlessly</h3>
                <p className="text-gray-600">
                  Posting a job is simple and hassle-free. Need help? We can connect you with top sellers in no
                  time.
                </p>
              </motion.div>
            </StaggeredChild>

            {/* Affordable Talent */}
            <StaggeredChild>
              <motion.div
                className="bg-white p-8 rounded-lg border border-gray-200"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                  borderColor: "rgba(0,0,0,0.2)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <h3 className="text-xl font-semibold mb-4">Affordable High-Quality Talent</h3>
                <p className="text-gray-600">
                  Hire skilled freelancers without stretching your budget, thanks to low transaction rates and
                  transparent pricing.
                </p>
              </motion.div>
            </StaggeredChild>
          </div>
        </StaggeredChildren>
      </div>
    </section>
  )
}
