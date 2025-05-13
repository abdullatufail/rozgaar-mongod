"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { ThreeDCard } from "../common/ThreeDCard"
import { MagneticButton } from "../animations/magnetic-button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"

interface Gig {
  id: string
  title: string
  description: string
  price: number
  category: string
  image: string
  freelancerId: string
  freelancer: {
    name: string
  }
  createdAt: string
  rating?: number
  totalReviews?: number
}

export function GigExploreSection() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const displayedGigs = screenWidth < 840 ? gigs.slice(0, 1) : gigs.slice(0, 3)

  useEffect(() => {
    fetchGigs()
  }, [])

  const fetchGigs = async (query = "") => {
    try {
      setIsLoading(true)
      const response = await api.get<{ gigs: Gig[]; pagination?: any }>(`/gigs${query ? `?search=${query}` : ""}`)
      setGigs(response.gigs || [])
    } catch (error) {
      console.error("Error fetching gigs:", error)
      setGigs([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-bold mb-6 text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Explore Our Gigs
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 text-center mb-6 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover top-rated services from talented freelancers across Pakistan
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center">
            <motion.div
              className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : (
          <motion.div
            className="flex justify-center gap-10 flex-wrap"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {displayedGigs.map((gig, index) => (
                <motion.div
                  key={gig.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                >
                  <ThreeDCard
                    id={gig.id}
                    title={gig.title}
                    image={gig.image}
                    price={gig.price}
                    rating={gig.rating || 0}
                    reviews={gig.totalReviews || 0}
                    category={gig.category}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <MagneticButton strength={30}>
            <Link href="/search/gigs">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className="px-8 py-6 text-lg bg-black text-white hover:bg-gray-800 relative overflow-hidden group">
                  <motion.span
                    className="absolute inset-0 bg-gray-700 rounded-md"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span className="relative z-10 flex items-center">
                    View All Gigs
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
