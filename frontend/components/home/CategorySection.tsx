"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { CATEGORIES } from "@/lib/constants"

export function CategorySection() {
  const navigateToCategory = (categoryName: string) => {
    window.location.href = `/search/gigs?category=${encodeURIComponent(categoryName)}`
  }

  return (
    <section className="py-16 md:py-24 px-8 md:px-4 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Browse services by category
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-4">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.button
                onClick={() => navigateToCategory(category.name)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow hover:bg-gray-50"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                  x: 5,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-lg font-medium">{category.name}</span>
                <div className="flex items-center">
                  <p className="hidden md:block text-sm text-gray-600 mr-8">{category.description}</p>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
