"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { api } from "../../../lib/api"
import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { useAuth } from "../../../contexts/auth-context"
import { GigCard } from "@/components/common/GigCard"
import type { Gig } from "@/services/gigs"
import Footer from "@/components/common/Footer"
import { Navbar } from "@/components/common/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import { FadeInWhenVisible } from "@/components/animations/fade-in-when-visible"
import { StaggeredChildren, StaggeredChild } from "@/components/animations/staggered-container"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { ScrollProgressIndicator } from "@/components/animations/scroll-progress-indicator"

// Available categories
const CATEGORIES = ["Web Development", "Mobile Development", "Graphic Design", "Content Writing", "Digital Marketing"]

// Price range options
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: 1000 },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 to $100", min: 51, max: 100 },
  { label: "$100 to $200", min: 101, max: 200 },
  { label: "$200 to $500", min: 201, max: 500 },
  { label: "$500+", min: 501, max: 1000 },
]

export default function GigsSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const initialQuery = searchParams.get("search") || ""
  const initialCategory = searchParams.get("category") || ""
  const initialMinPrice = searchParams.get("minPrice") || "0"
  const initialMaxPrice = searchParams.get("maxPrice") || "1000"

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(
    PRICE_RANGES.findIndex((range) => range.min === Number(initialMinPrice) && range.max === Number(initialMaxPrice)) ||
      0,
  )

  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { logout } = useAuth()

  useEffect(() => {
    fetchGigs()
  }, [searchParams])

  const fetchGigs = async () => {
    try {
      setIsLoading(true)

      // Build query parameters
      const params = new URLSearchParams()

      if (searchParams.get("search")) {
        params.append("search", searchParams.get("search")!.trim())
      }

      if (searchParams.get("category")) {
        params.append("category", searchParams.get("category") as string)
      }

      if (searchParams.get("minPrice")) {
        params.append("minPrice", searchParams.get("minPrice") as string)
      }

      if (searchParams.get("maxPrice")) {
        params.append("maxPrice", searchParams.get("maxPrice") as string)
      }

      const queryString = params.toString() ? `?${params.toString()}` : ""
      const response = await api.get<{ gigs: Gig[]; pagination?: any }>(`/gigs${queryString}`)

      // Extract gigs array from response
      const gigsData = response.gigs || []

      // If search query exists, filter gigs to ensure they have the search term in title
      const searchQuery = searchParams.get("search")?.trim()
      if (searchQuery) {
        const filteredGigs = gigsData.filter((gig) => gig.title.toLowerCase().includes(searchQuery.toLowerCase()))
        setGigs(filteredGigs)
      } else {
        setGigs(gigsData)
      }
    } catch (error) {
      console.error("Error fetching gigs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearchParams()
  }

  const updateSearchParams = () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove search parameter
    if (searchQuery) {
      params.set("search", searchQuery.trim())
    } else {
      params.delete("search")
    }

    // Update or remove category parameter
    if (selectedCategory) {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }

    // Update price range parameters
    const priceRange = PRICE_RANGES[selectedPriceRange]
    if (priceRange.min > 0) {
      params.set("minPrice", priceRange.min.toString())
    } else {
      params.delete("minPrice")
    }

    if (priceRange.max < 1000) {
      params.set("maxPrice", priceRange.max.toString())
    } else {
      params.delete("maxPrice")
    }

    // Navigate to new URL with updated parameters
    router.push(`/search/gigs?${params.toString()}`)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
    setTimeout(() => updateSearchParams(), 0)
  }

  const handlePriceRangeSelect = (index: number) => {
    setSelectedPriceRange(index)
    setTimeout(() => updateSearchParams(), 0)
  }

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      {/* Progress bar */}
      <ScrollProgressIndicator />

      <Navbar
        selectedCategory={selectedCategory}
        selectedPriceRange={PRICE_RANGES[selectedPriceRange]}
        onSearch={(query) => {
          setSearchQuery(query)
          updateSearchParams()
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <motion.div
          className="mb-8 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          <span className="font-medium">Filters</span>

          <MagneticButton strength={30}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm transition-all duration-300 hover:shadow-md"
                >
                  <span>{selectedCategory || "Category"}</span>
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 0.5, repeat: 0, repeatType: "reverse", ease: "easeInOut" }}
                  >
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {CATEGORIES.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={selectedCategory === category ? "bg-gray-100" : ""}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
                {selectedCategory && (
                  <DropdownMenuItem onClick={() => handleCategorySelect("")}>Clear Filter</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </MagneticButton>

          <MagneticButton strength={30}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm transition-all duration-300 hover:shadow-md"
                >
                  <span>{PRICE_RANGES[selectedPriceRange].label}</span>
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 0.5, repeat: 0, repeatType: "reverse", ease: "easeInOut" }}
                  >
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {PRICE_RANGES.map((range, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handlePriceRangeSelect(index)}
                    className={selectedPriceRange === index ? "bg-gray-100" : ""}
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </MagneticButton>

          {(selectedCategory || selectedPriceRange > 0) && (
            <MagneticButton strength={30}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="outline"
                  className="flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm transition-all duration-300 hover:shadow-md"
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedPriceRange(0)
                    router.push("/search/gigs")
                  }}
                >
                  Clear All Filters
                </Button>
              </motion.div>
            </MagneticButton>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <motion.div
              className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : (
          <StaggeredChildren
            staggerDelay={0.1}
            containerDelay={0.2}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {gigs.map((gig, index) => (
                <StaggeredChild key={gig.id}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <GigCard gig={gig} />
                  </motion.div>
                </StaggeredChild>
              ))}
            </AnimatePresence>

            {gigs.length === 0 && (
              <FadeInWhenVisible className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <motion.h3
                  className="text-xl font-medium mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  No gigs found
                </motion.h3>
                <motion.p
                  className="text-gray-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Try adjusting your search or filters
                </motion.p>
              </FadeInWhenVisible>
            )}
          </StaggeredChildren>
        )}
      </main>

      <Footer />
    </div>
  )
}
