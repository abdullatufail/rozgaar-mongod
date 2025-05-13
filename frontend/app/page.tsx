"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { motion, useScroll, useSpring } from "framer-motion"
import { PageTransition } from "../components/animations"
import Footer from "@/components/common/Footer"

// Static loading indicator
const LoadingSpinner = () => (
  <div className="flex justify-center">
    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
  </div>
)

// Dynamically import client components with lazy loading
const Header = dynamic(() => import("../components/home").then(mod => mod.Header), {
  ssr: true,
  loading: () => <div className="h-24"></div>
})

const HeroSection = dynamic(() => import("../components/home").then(mod => mod.HeroSection), {
  ssr: true,
  loading: () => <div className="h-96"></div>
})

const ClientPreferenceSection = dynamic(
  () => import("../components/home").then(mod => mod.ClientPreferenceSection),
  { ssr: true, loading: () => <LoadingSpinner /> }
)

const CategorySection = dynamic(() => import("../components/home").then(mod => mod.CategorySection), {
  ssr: true,
  loading: () => <LoadingSpinner />
})

const GigExploreSection = dynamic(() => import("../components/home").then(mod => mod.GigExploreSection), {
  ssr: true,
  loading: () => <LoadingSpinner />
})

const StartTodaySection = dynamic(() => import("../components/home").then(mod => mod.StartTodaySection), {
  ssr: true,
  loading: () => <LoadingSpinner />
})

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <PageTransition>
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-black z-50 origin-left" style={{ scaleX }} />

      <div style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Suspense fallback={<div className="h-24"></div>}>
          <Header />
        </Suspense>

        <main>
          <Suspense fallback={<div className="h-96"></div>}>
            <HeroSection />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <ClientPreferenceSection />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <CategorySection />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <GigExploreSection />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <StartTodaySection />
          </Suspense>

          <Footer />
        </main>
      </div>
    </PageTransition>
  )
}
