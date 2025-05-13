"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { SearchBar } from "../components/common/SearchBar"
import { api } from "../lib/api"
import { ArrowRight, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useAuth } from "../contexts/auth-context"
import { PageTransition } from "../components/animations"
import Footer from "@/components/common/Footer"
import { useRouter, useSearchParams } from "next/navigation"
import { ThreeDCard } from "../components/common/ThreeDCard"
import { CATEGORIES } from "@/lib/constants"
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion"

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

import { FloatingElement } from "../components/animations/floating-element"
import { MagneticButton } from "../components/animations/magnetic-button"
import { ParallaxSection } from "../components/animations/parallax-section"
import { StaggeredChildren, StaggeredChild } from "../components/animations/staggered-container"
import { FadeInWhenVisible } from "../components/animations/fade-in-when-visible"



export default function Home() {
  const { user, logout } = useAuth()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/search/gigs${searchQuery ? `?search=${searchQuery}` : ""}`
  }

  const navigateToCategory = (categoryName: string) => {
    window.location.href = `/search/gigs?category=${encodeURIComponent(categoryName)}`
  }

  const updateSearchParams = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery) {
      params.set("search", searchQuery.trim())
    } else {
      params.delete("search")
    }

    router.push(`/search/gigs?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <motion.div
            className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-black z-50 origin-left" style={{ scaleX }} />

      <div style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
        {/* Header */}
        <motion.header
          className="container mx-auto px-8 md:px-4 py-6 flex items-center justify-between"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
        >
          <nav className="flex space-x-6">
            <Link href="/search/gigs" className="text-gray-600 hover:text-black relative group">
              <span>Explore Gigs</span>
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-black"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </nav>

          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-3xl font-bold">
              <motion.span
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.span
                  className="text-black"
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    repeatDelay: 5,
                  }}
                >
                  *
                </motion.span>
                <span className="ml-1">rozgaar</span>
              </motion.span>
            </Link>
          </div>

          {!user ? (
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MagneticButton>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-black px-4 py-2 rounded-full border border-gray-300 transition-all duration-300 hover:shadow-md"
                >
                  Log in
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/register"
                  className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                >
                  Sign up
                </Link>
              </MagneticButton>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">{user.name}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          )}
        </motion.header>

        <main>
          {/* Hero Section */}
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
              </FadeInWhenVisible>

              <motion.div
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
                  <SearchBar
                    className="w-full max-w-xl mx-auto"
                    defaultQuery={searchQuery}
                    onSearch={(query) => {
                      setSearchQuery(query)
                      setTimeout(() => updateSearchParams(), 0)
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Why clients prefer rozgaar */}
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

          {/* Browse services by category */}
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

          {/* Explore Our Gigs Section */}
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

          {/* Start Today Section */}
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

          <Footer />
        </main>
      </div>
    </PageTransition>
  )
}
