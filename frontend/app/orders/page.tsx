"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"
import * as orderService from "../../services/orders"
import { Button } from "../../components/ui/button"
import { useToast } from "../../components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Navbar } from "@/components/common/Navbar"
import { PageTransition } from "../../components/animations"
import { Package, DollarSign, Clock, ArrowRight } from "lucide-react"
import Footer from "@/components/common/Footer"
import { motion, AnimatePresence } from "framer-motion"

// Import advanced animation components
import { FadeInWhenVisible } from "@/components/animations/fade-in-when-visible"
import { StaggeredChildren, StaggeredChild } from "@/components/animations/staggered-container"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { ScrollProgressIndicator } from "@/components/animations/scroll-progress-indicator"
import { TextReveal } from "@/components/animations/text-reveal"

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<orderService.Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only redirect if we're definitely not authenticated (user is null AND loading is false)
    if (!user && !authLoading) {
      // Save the current URL to localStorage before redirecting
      if (typeof window !== 'undefined') {
        localStorage.setItem('returnUrl', window.location.pathname)
      }
      router.push("/login")
      return
    }
    
    // Only fetch data if we're authenticated
    if (user) {
      loadOrders()
    }
  }, [user, authLoading])

  const loadOrders = async () => {
    try {
      console.log("Fetching orders for user:", user?.id)
      const ordersData = await orderService.orderService.fetchOrders()
      console.log("Received orders:", ordersData)
      setOrders(ordersData)
    } catch (error) {
      console.error("Error fetching orders:", error)
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
        })
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "cancellation_requested":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
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

  return (
    <PageTransition>
      {/* Progress bar */}
      <ScrollProgressIndicator />

      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <FadeInWhenVisible>
          <div className="mb-8 flex items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Package className="mr-3 h-7 w-7" />
            </motion.div>
            <TextReveal text={<h1 className="text-3xl font-bold">My Orders</h1>} />
          </div>
        </FadeInWhenVisible>

        {orders.length === 0 ? (
          <FadeInWhenVisible delay={0.2}>
            <motion.div
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="mb-4 rounded-full bg-gray-100 p-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Package className="h-12 w-12 text-gray-400" />
              </motion.div>
              <motion.h2
                className="text-xl font-semibold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                No orders found
              </motion.h2>
              <motion.p
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                You haven't placed or received any orders yet.
              </motion.p>
              <MagneticButton strength={30}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button onClick={() => router.push("/search/gigs")}>Browse Gigs</Button>
                </motion.div>
              </MagneticButton>
            </motion.div>
          </FadeInWhenVisible>
        ) : (
          <StaggeredChildren staggerDelay={0.1} containerDelay={0.2} className="grid gap-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <StaggeredChild key={order.id}>
                  <motion.div
                    className="rounded-lg border overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className={`px-4 py-2 ${getStatusColor(order.status)}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      style={{ originX: 0 }}
                    >
                      <span className="font-medium">{formatStatus(order.status)}</span>
                    </motion.div>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold flex items-center">Order #{order.id}</h2>
                          <div className="flex items-center text-gray-500 mt-1">
                            <motion.div
                              animate={{
                                rotate: [0, 360],
                              }}
                              transition={{
                                duration: 20,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                            </motion.div>
                            <p className="text-sm">Created {formatDistanceToNow(new Date(order.createdAt))} ago</p>
                          </div>
                          <p className="mt-2 text-gray-600">{order.gig?order.gig.title:"Deleted Gig"}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <motion.div
                            className="flex items-center justify-end"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                          >
                            <motion.div
                              animate={{
                                y: [0, -5, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                                ease: "easeInOut",
                                delay: index * 0.2,
                              }}
                            >
                              <DollarSign className="h-5 w-5 text-gray-700" />
                            </motion.div>
                            <p className="text-xl font-bold">${order.price}</p>
                          </motion.div>
                          <div className="mt-2 flex justify-end">
                            <MagneticButton strength={20}>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              >
                                <Button
                                  onClick={() => router.push(`/orders/${order.id}`)}
                                  className="flex items-center relative overflow-hidden group"
                                >
                                  <motion.span
                                    className="absolute inset-0 bg-gray-700 rounded-md"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileHover={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                  <span className="relative z-10">View Details</span>
                                  <motion.div
                                    className="relative z-10 ml-1"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    <ArrowRight className="h-4 w-4" />
                                  </motion.div>
                                </Button>
                              </motion.div>
                            </MagneticButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggeredChild>
              ))}
            </AnimatePresence>
          </StaggeredChildren>
        )}
      </div>
      <Footer />
    </PageTransition>
  )
}
