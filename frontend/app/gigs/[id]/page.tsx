"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "../../../contexts/auth-context"
import { orderService } from "../../../services/orders"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { useToast } from "../../../components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { api, ApiError } from "../../../lib/api"
import { Star } from "../../../components/ui/star"
import { Navbar } from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"
import { reviewService } from "@/services/reviews"
import { motion, AnimatePresence } from "framer-motion"
import { FadeInWhenVisible } from "@/components/animations/fade-in-when-visible"
import { StaggeredChildren, StaggeredChild } from "@/components/animations/staggered-container"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { ScrollProgressIndicator } from "@/components/animations/scroll-progress-indicator"
import { ParallaxSection } from "@/components/animations/parallax-section"
import { TextReveal } from "@/components/animations/text-reveal"
import { FloatingElement } from "@/components/animations/floating-element"

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
  durationDays?: number
}

interface Review {
  id: string
  orderId: string
  rating: number
  comment?: string
  createdAt: string
  client?: {
    name: string
  }
}

export default function GigPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [gig, setGig] = useState<Gig | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [orderLoading, setOrderLoading] = useState(false)
  const [requirements, setRequirements] = useState("")

  useEffect(() => {
    const loadData = async () => {
      await fetchGig()
      await fetchReviews()
    }

    loadData()
  }, [params.id])

  useEffect(() => {
    if (reviews.length > 0) {
      fetchGig()
    }
  }, [reviews])

  const fetchGig = async () => {
    try {
      setLoading(true)
      const response = await api.get<Gig>(`/gigs/${params.id}`)
      setGig(response)
    } catch (error) {
      console.error("Error fetching gig:", error)
      toast({
        title: "Error",
        description: "Failed to fetch gig details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getGigReviews(params.id)
      console.log("Fetched reviews:", response)
      setReviews(response)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const handleOrder = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "client") {
      toast({
        title: "Error",
        description: "Only clients can place orders",
        variant: "destructive",
      })
      return
    }

    if (!requirements.trim()) {
      toast({
        title: "Error",
        description: "Please provide your requirements",
        variant: "destructive",
      })
      return
    }

    setOrderLoading(true)
    try {
      const order = await orderService.createOrder(params.id, requirements)
      toast({
        title: "Success",
        description: "Order placed successfully",
      })
      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)

      // Check if it's an insufficient balance error
      let errorMessage = "Failed to place order"

      if (error instanceof ApiError && error.responseData) {
        if (error.responseData.message === "Insufficient balance") {
          errorMessage = `Insufficient balance. Required: $${error.responseData.required}, Available: $${error.responseData.current.toFixed(
            2,
          )}`
        } else {
          errorMessage = error.responseData.message || errorMessage
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setOrderLoading(false)
    }
  }

  if (loading) {
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

  if (!gig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">Gig not found</div>
      </div>
    )
  }

  return (
    <>
      {/* Progress bar */}
      <ScrollProgressIndicator />

      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <motion.div
              className="relative aspect-video w-full overflow-hidden rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
            >
              <Image
                src={gig.image || "https://via.placeholder.com/800x450"}
                alt={gig.title}
                fill
                className="object-cover"
              />
            </motion.div>
            <FadeInWhenVisible>
              <div>
                <TextReveal text={<h1 className="text-3xl font-bold">{gig.title}</h1>} />
                <motion.p
                  className="mt-2 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Posted {formatDistanceToNow(new Date(gig.createdAt))} ago
                </motion.p>
              </div>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold">Description</h2>
                <p>{gig.description}</p>
              </div>
            </FadeInWhenVisible>
            {reviews.length > 0 ? (
              <FadeInWhenVisible delay={0.3}>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  <StaggeredChildren staggerDelay={0.15} containerDelay={0.2} className="space-y-4">
                    <AnimatePresence>
                      {reviews.map((review) => (
                        <StaggeredChild key={review.id}>
                          <motion.div
                            className="rounded-2xl border p-6 shadow-sm"
                            whileHover={{
                              y: -5,
                              boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                              borderColor: "rgba(0,0,0,0.2)",
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <motion.div
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-700"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                {review.client?.name?.[0] || "U"}
                              </motion.div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-lg">{review.client?.name || "Unknown User"}</span>
                                </div>
                              </div>
                            </div>
                            <hr className="my-2" />
                            <div className="flex items-center gap-2 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                                >
                                  <Star key={i} filled={i < review.rating} />
                                </motion.div>
                              ))}
                              <span className="font-medium ml-2">{review.rating}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-muted-foreground text-sm">
                                {formatDistanceToNow(new Date(review.createdAt))} ago
                              </span>
                            </div>
                            <div className="text-lg mb-4">{review.comment || "No comment provided"}</div>
                          </motion.div>
                        </StaggeredChild>
                      ))}
                    </AnimatePresence>
                  </StaggeredChildren>
                </div>
              </FadeInWhenVisible>
            ) : (
              <FadeInWhenVisible delay={0.3}>
                <div className="text-muted-foreground">No reviews yet</div>
              </FadeInWhenVisible>
            )}
          </div>

          <ParallaxSection baseVelocity={0.05}>
            <FloatingElement amount={5} speed={0}>
              <motion.div
                className="sticky top-8 rounded-lg border bg-card p-6 transition-all"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)",
                  borderColor: "rgba(0,0,0,0.2)",
                  borderWidth: "2px",
                  
                }}
              >
                <div className="mb-6">
                  <motion.p
                    className="text-3xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    ${gig.price}
                  </motion.p>
                  <motion.p
                    className="mt-1 text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}                  >
                    by {gig.freelancer?.name || 'Unknown Freelancer'}
                  </motion.p>
                  {gig.rating !== undefined && (
                    <motion.div
                      className="mt-2 flex items-center gap-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <motion.div
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
                        <Star filled />
                      </motion.div>
                      <span className="font-medium">
                        {typeof gig.rating === "number" ? gig.rating.toFixed(1) : "0"}
                      </span>
                      <span className="text-muted-foreground">
                        ({gig.totalReviews || 0} {gig.totalReviews === 1 ? "review" : "reviews"})
                      </span>
                    </motion.div>
                  )}
                </div>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="font-medium">Category</h3>
                    <p className="text-muted-foreground">{gig.category}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <h3 className="font-medium">Delivery Time</h3>
                    <p className="text-muted-foreground">{gig.durationDays || 7} days</p>
                  </motion.div>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <label htmlFor="requirements" className="text-sm font-medium">
                      Your Requirements
                    </label>
                    <Input
                      id="requirements"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Describe what you need..."
                      className="h-24 transition-all duration-300 focus:border-black focus:ring-2 focus:ring-black"
                    />
                  </motion.div>
                  <MagneticButton strength={20}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        onClick={handleOrder}
                        disabled={orderLoading || !requirements.trim()}
                        className="w-full relative overflow-hidden group"
                      >
                        <motion.span
                          className="absolute inset-0 bg-gray-700 rounded-md"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10">{orderLoading ? "Processing..." : "Order Now"}</span>
                      </Button>
                    </motion.div>
                  </MagneticButton>
                  {!user && (
                    <motion.p
                      className="text-sm text-muted-foreground text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      Please login to place an order
                    </motion.p>
                  )}
                  {user?.role !== "client" && (
                    <motion.p
                      className="text-sm text-muted-foreground text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      Only clients can place orders
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </FloatingElement>
          </ParallaxSection>
        </div>
      </div>
      <Footer />
    </>
  )
}
