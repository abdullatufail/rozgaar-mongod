"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/auth-context"
import { useToast } from "../../../components/ui/use-toast"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import type { Order } from "../../../services/orders"
import * as orderService from "../../../services/orders"
import { api, type ApiError } from "../../../lib/api"
import { Star } from "../../../components/ui/star"
import { PageTransition } from "../../../components/animations"
import {
  ClipboardList,
  Clock,
  Package,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Upload,
  AlertTriangle,
  Timer,
  DollarSign,
} from "lucide-react"
import Footer from "@/components/common/Footer"
import { motion, useScroll, useTransform } from "framer-motion"

// Import advanced animation components
import { FadeInWhenVisible } from "@/components/animations/fade-in-when-visible"
import { StaggeredChildren, StaggeredChild } from "@/components/animations/staggered-container"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { TextReveal } from "@/components/animations/text-reveal"
import { FloatingElement } from "@/components/animations/floating-element"

const CountdownTimer = ({ dueDate, orderStatus }: { dueDate: string; orderStatus: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    // If order is completed or cancelled, don't start the timer
    if (orderStatus === "completed" || orderStatus === "cancelled") {
      return
    }

    const calculateTimeLeft = () => {
      const difference = new Date(dueDate).getTime() - new Date().getTime()

      if (difference <= 0) {
        setIsPast(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      setIsPast(false)
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [dueDate, orderStatus])

  // For completed orders, show a completion message instead of the timer
  if (orderStatus === "completed") {
    return (
      <motion.div
        className="p-3 bg-green-50 border border-green-100 rounded-md text-green-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="font-medium flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
          </motion.div>
          Order Completed
        </motion.div>
      </motion.div>
    )
  }

  // For cancelled orders, show a cancellation message
  if (orderStatus === "cancelled") {
    return (
      <motion.div
        className="p-3 bg-red-50 border border-red-100 rounded-md text-red-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="font-medium flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
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
              repeatDelay: 3,
            }}
          >
            <XCircle className="mr-2 h-5 w-5" />
          </motion.div>
          Order Cancelled
        </motion.div>
      </motion.div>
    )
  }

  if (isPast) {
    return (
      <motion.div
        className="p-3 bg-red-50 border border-red-100 rounded-md text-red-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="font-medium flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
          </motion.div>
          Delivery Overdue
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="p-3 bg-blue-50 border border-blue-100 rounded-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="font-medium text-blue-800 mb-2 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
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
          <Clock className="mr-2 h-5 w-5" />
        </motion.div>
        Time Remaining
      </motion.div>
      <motion.div className="grid grid-cols-4 gap-2 text-center">
        <motion.div
          className="bg-white p-2 rounded shadow-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 15 }}
        >
          <motion.div
            className="text-xl font-bold"
            animate={{ scale: timeLeft.days === 0 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timeLeft.days === 0 ? Number.POSITIVE_INFINITY : 0, repeatDelay: 2 }}
          >
            {timeLeft.days}
          </motion.div>
          <div className="text-xs text-gray-500">Days</div>
        </motion.div>
        <motion.div
          className="bg-white p-2 rounded shadow-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}
        >
          <motion.div
            className="text-xl font-bold"
            animate={{ scale: timeLeft.days === 0 && timeLeft.hours < 5 ? [1, 1.1, 1] : 1 }}
            transition={{
              duration: 0.5,
              repeat: timeLeft.days === 0 && timeLeft.hours < 5 ? Number.POSITIVE_INFINITY : 0,
              repeatDelay: 2,
            }}
          >
            {timeLeft.hours}
          </motion.div>
          <div className="text-xs text-gray-500">Hours</div>
        </motion.div>
        <motion.div
          className="bg-white p-2 rounded shadow-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 15 }}
        >
          <div className="text-xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-gray-500">Mins</div>
        </motion.div>
        <motion.div
          className="bg-white p-2 rounded shadow-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 15 }}
        >
          <div className="text-xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-gray-500">Secs</div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const Spinner = () => (
  <motion.div
    className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
  />
)

export default function OrderPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [order, setOrder] = useState<Order | null>(null)
  const [orderLoading, setOrderLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [reason, setReason] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isDelivering, setIsDelivering] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showDeliverDialog, setShowDeliverDialog] = useState(false)
  const [showCancellationDialog, setShowCancellationDialog] = useState(false)

  // Scroll animation
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Helper function to safely compare IDs
  const isSameId = (id1: any, id2: any) => {
    if (!id1 || !id2) return false
    return String(id1) === String(id2)
  }

  useEffect(() => {
    // Only redirect if we're definitely not authenticated (user is null AND loading is false)
    if (!user && !loading) {
      // Save the current URL to localStorage before redirecting
      if (typeof window !== 'undefined') {
        localStorage.setItem('returnUrl', window.location.pathname)
      }
      router.push("/login")
      return
    }
    
    // Only fetch data if we're authenticated
    if (user) {
      fetchOrder()
    }
  }, [user, loading, orderId, router])

  const fetchOrder = async () => {
    try {
      const data = await orderService.orderService.fetchOrder(orderId as string)
      setOrder(data)
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error fetching order:", apiError)
      toast({
        title: "Error",
        description: apiError.message || "Failed to fetch order details",
        variant: "destructive",
      })
    } finally {
      setOrderLoading(false)
    }
  }

  const handleDeliverOrder = async () => {
    console.log("Deliver Order clicked with file:", file, "and notes:", notes);
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please provide a file",
        variant: "destructive",
      })
      return
    }
    if (!notes) {
      toast({
        title: "Error",
        description: "Please provide delivery notes",
        variant: "destructive",
      })
      return
    }
    setIsDelivering(true)
    try {
      console.log("Attempting to deliver order with ID:", orderId);
      await orderService.orderService.deliverOrder(orderId as string, file, notes)
      toast({
        title: "Success",
        description: "Order delivered successfully",
      })
      setShowDeliverDialog(false)
      setFile(null)
      setNotes("")
      fetchOrder()
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error delivering order:", apiError)
      toast({
        title: "Error",
        description: apiError.message || "Failed to deliver order",
        variant: "destructive",
      })
    } finally {
      setIsDelivering(false)
    }
  }

  const handleApproveDelivery = async () => {
    try {
      await orderService.orderService.approveDelivery(orderId as string)
      toast({
        title: "Success",
        description: "Delivery approved",
      })

      // Show review dialog after approving delivery
      setShowReviewDialog(true)
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error approving delivery:", apiError)
      toast({
        title: "Error",
        description: apiError.message || "Failed to approve delivery",
        variant: "destructive",
      })
    }
  }

  const handleRejectDelivery = async () => {
    try {
      await orderService.orderService.rejectDelivery(orderId as string)
      toast({
        title: "Success",
        description: "Delivery rejected",
      })
      fetchOrder()
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error rejecting delivery:", apiError)
      toast({
        title: "Error",
        description: apiError.message || "Failed to reject delivery",
        variant: "destructive",
      })
    }
  }

  const handleRequestCancellation = async () => {
    console.log("Requesting cancellation with reason:", reason);
    
    if (!reason) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      })
      return
    }
    setIsCancelling(true)
    try {
      console.log("Attempting to request cancellation for order ID:", orderId);
      await orderService.orderService.requestCancellation(orderId as string, reason)
      toast({
        title: "Success",
        description: "Cancellation requested",
      })
      setShowCancellationDialog(false)
      setReason("")
      fetchOrder()
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error requesting cancellation:", apiError)
      toast({
        title: "Error",
        description: apiError.message || "Failed to request cancellation",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleApproveCancellation = async () => {
    try {
      await orderService.orderService.approveCancellation(orderId as string)
      toast({
        title: "Success",
        description: "Cancellation approved",
      })
      fetchOrder()
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error approving cancellation:", apiError)
      toast({
        title: "Error",
        description: apiError.message || "Failed to approve cancellation",
        variant: "destructive",
      })
    }
  }

  const handleRejectCancellation = async () => {
    try {
      await orderService.orderService.rejectCancellation(orderId as string)
      toast({
        title: "Success",
        description: "Cancellation rejected",
      })
      fetchOrder()
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error rejecting cancellation:", apiError)
      toast({
        title: "Error",
        description: apiError.message || "Failed to reject cancellation",
        variant: "destructive",
      })
    }
  }

  const handleAddReview = async () => {
    if (rating < 1 || rating > 5) {
      toast({
        title: "Error",
        description: "Please provide a rating between 1 and 5",
        variant: "destructive",
      })
      return
    }

    setIsReviewing(true)
    try {
      await orderService.orderService.addReview(orderId as string, rating, comment)
      toast({
        title: "Success",
        description: "Review added successfully",
      })

      // Close the review dialog
      setShowReviewDialog(false)

      // Fetch the updated order with the review
      fetchOrder()

      // Refresh the gig data to update the rating and totalReviews count
      if (order?.gigId) {
        try {
          await api.get(`/gigs/${order.gigId}`)
          console.log("Successfully refreshed gig data")
        } catch (error) {
          console.error("Failed to refresh gig data:", error)
        }
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error adding review:", apiError)

      // Check if error message indicates a duplicate review
      let errorMessage = "Failed to add review"

      if (apiError.message) {
        if (apiError.message.includes("Review already exists")) {
          errorMessage = "You have already submitted a review for this order"
        } else if (apiError.responseData?.message) {
          errorMessage = apiError.responseData.message
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsReviewing(false)
    }
  }

  const handleStartOrder = async () => {
    try {
      await orderService.orderService.updateOrderStatus(orderId as string, "in_progress")
      toast({
        title: "Success",
        description: "Order started successfully",
      })
      fetchOrder()
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error("Error starting order:", apiError)
      toast({
        title: "Error",
        description: apiError.message || "Failed to start order",
        variant: "destructive",
      })
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
      case "late":
        return "bg-red-100 text-red-800"
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

  if (orderLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.h1
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Order not found
        </motion.h1>
        <MagneticButton>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
          </motion.div>
        </MagneticButton>
      </div>
    )
  }

  return (
    <PageTransition>
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-black z-50 origin-left" style={{ scaleX }} />

      <div className="container mx-auto py-8 px-4">
        <FadeInWhenVisible>
          <div className="mb-6 flex items-center">
            <MagneticButton strength={20}>
              <motion.div
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button variant="outline" onClick={() => router.push("/orders")} className="mr-4">
                  &larr; Back to Orders
                </Button>
              </motion.div>
            </MagneticButton>
            <motion.div className="flex items-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Package className="mr-2 h-6 w-6" />
              </motion.div>
              <TextReveal text={<h1 className="text-3xl font-bold">Order #{order.id}</h1>} />
            </motion.div>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Order Details */}
          <FadeInWhenVisible className="lg:col-span-3">
            <motion.div
              className="bg-white shadow-md rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Status Banner */}
              <motion.div
                className={`px-6 py-3 ${getStatusColor(order.status)}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ originX: 0 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{formatStatus(order.status)}</span>
                  <span className="text-sm flex items-center">
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
                      <Clock className="inline mr-1 h-4 w-4" />
                    </motion.div>
                    {formatDistanceToNow(new Date(order.createdAt))} ago
                  </span>
                </div>
              </motion.div>

              {/* Order Info */}
              <div className="p-6">
                <StaggeredChildren
                  staggerDelay={0.1}
                  containerDelay={0.2}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                >
                  <StaggeredChild>
                    <motion.div
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="p-4 rounded-lg border border-gray-100"
                    >
                      <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
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
                          <ClipboardList className="mr-2 h-5 w-5" />
                        </motion.div>
                        Gig Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Gig Title</p>
                          <p className="font-medium">{order.gig.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <div className="flex items-center">
                            <motion.div
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
                              <DollarSign className="h-4 w-4 mr-1 text-gray-700" />
                            </motion.div>
                            <p className="font-medium">${order.price}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </StaggeredChild>
                  <StaggeredChild>
                    <motion.div
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="p-4 rounded-lg border border-gray-100"
                    >
                      <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            repeatDelay: 7,
                          }}
                        >
                          <User className="mr-2 h-5 w-5" />
                        </motion.div>
                        People
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Client</p>
                          <p className="font-medium">{order.client.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Freelancer</p>
                          <p className="font-medium">{order.freelancer.name}</p>
                        </div>
                      </div>
                    </motion.div>
                  </StaggeredChild>
                </StaggeredChildren>

                <FadeInWhenVisible delay={0.3}>
                  <motion.div
                    className="mb-6"
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          ease: "easeInOut",
                          repeatDelay: 9,
                        }}
                      >
                        <FileText className="mr-2 h-5 w-5" />
                      </motion.div>
                      Requirements
                    </h3>
                    <motion.div
                      className="bg-gray-50 p-4 rounded-md whitespace-pre-line"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {order.requirements}
                    </motion.div>
                  </motion.div>
                </FadeInWhenVisible>

                {/* Delivery timeline */}
                <FadeInWhenVisible delay={0.4}>
                  <motion.div
                    className="mb-6"
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
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
                        <Timer className="mr-2 h-5 w-5" />
                      </motion.div>
                      Delivery Timeline
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        className="flex justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <span>Order Created:</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </motion.div>
                      {order.dueDate && (
                        <motion.div
                          className="flex justify-between"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <span>Due Date:</span>
                          <span className={order.isLate ? "text-red-600 font-medium" : ""}>
                            {new Date(order.dueDate).toLocaleDateString()}
                            {order.isLate && (
                              <motion.span
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{
                                  duration: 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "reverse",
                                }}
                              >
                                {" "}
                                (Late)
                              </motion.span>
                            )}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {order.isLate && order.status !== "cancelled" && order.status !== "completed" && (
                      <motion.div
                        className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <div className="flex items-start">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                            }}
                          >
                            <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                          </motion.div>
                          <div>
                            <p className="text-red-800 font-medium">This order is past its due date</p>
                            {order.status === "late" && (
                              <p className="text-sm text-red-700 mt-1">
                                {user?.role === "client"
                                  ? "You can cancel this order without waiting for approval since it's past the due date."
                                  : "The client can cancel this order without your approval since it's past the due date."}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </FadeInWhenVisible>

                {/* Delivery Details */}
                {order.status === "delivered" && (
                  <FadeInWhenVisible delay={0.5}>
                    <motion.div
                      className="mb-6"
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
                        <motion.div
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
                          <Upload className="mr-2 h-5 w-5" />
                        </motion.div>
                        Delivery Details
                      </h3>
                      <div className="space-y-4">
                        {order.deliveryFile && (
                          <motion.div
                            className="bg-blue-50 p-4 rounded-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-500 mb-2">Delivery File</p>
                            <motion.a
                              href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${order.deliveryFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Download File
                            </motion.a>
                          </motion.div>
                        )}

                        {order.deliveryNotes && (
                          <motion.div
                            className="bg-blue-50 p-4 rounded-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-500 mb-2">Delivery Notes</p>
                            <p className="whitespace-pre-line">{order.deliveryNotes}</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </FadeInWhenVisible>
                )}

                {/* Cancellation Request */}
                {order.status === "cancellation_requested" && (
                  <FadeInWhenVisible delay={0.5}>
                    <motion.div
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.h3
                        className="text-lg font-semibold text-yellow-800 mb-2 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
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
                            repeatDelay: 3,
                          }}
                        >
                          <AlertTriangle className="mr-2 h-5 w-5" />
                        </motion.div>
                        Cancellation Requested
                      </motion.h3>
                      <motion.p
                        className="text-yellow-700 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        Reason: {order.cancellationReason}
                      </motion.p>
                      {order.cancellationRequestedBy === order.freelancerId
                        ? // If freelancer requested cancellation, client can approve/reject
                          user?.role === "client" && (
                            <motion.div
                              className="flex gap-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                            >
                              <MagneticButton strength={20}>
                                <motion.button
                                  onClick={handleApproveCancellation}
                                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <CheckCircle className="inline mr-2 h-4 w-4" />
                                  Approve Cancellation
                                </motion.button>
                              </MagneticButton>
                              <MagneticButton strength={20}>
                                <motion.button
                                  onClick={handleRejectCancellation}
                                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <XCircle className="inline mr-2 h-4 w-4" />
                                  Reject Cancellation
                                </motion.button>
                              </MagneticButton>
                            </motion.div>
                          )
                        : // If client requested cancellation, freelancer can approve/reject
                          user?.role === "freelancer" && (
                            <motion.div
                              className="flex gap-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                            >
                              <MagneticButton strength={20}>
                                <motion.button
                                  onClick={handleApproveCancellation}
                                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <CheckCircle className="inline mr-2 h-4 w-4" />
                                  Approve Cancellation
                                </motion.button>
                              </MagneticButton>
                              <MagneticButton strength={20}>
                                <motion.button
                                  onClick={handleRejectCancellation}
                                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <XCircle className="inline mr-2 h-4 w-4" />
                                  Reject Cancellation
                                </motion.button>
                              </MagneticButton>
                            </motion.div>
                          )}
                    </motion.div>
                  </FadeInWhenVisible>
                )}

                {/* Review */}
                {order.status === "completed" && order.review && (
                  <FadeInWhenVisible delay={0.6}>
                    <motion.div
                      className="mb-6"
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center">
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 10, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            repeatDelay: 4,
                          }}
                        >
                          <Star filled className="mr-2 h-5 w-5 text-black" />
                        </motion.div>
                        Review
                      </h3>
                      <motion.div
                        className="bg-yellow-50 p-4 rounded-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star, index) => (
                            <motion.div
                              key={star}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 300, damping: 15 }}
                            >
                              <Star
                                filled={star <= order.review!.rating}
                                className={`h-5 w-5 ${star <= order.review!.rating ? "text-black" : "text-gray-300"}`}
                              />
                            </motion.div>
                          ))}
                          <motion.span
                            className="ml-2 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                          >
                            {order.review.rating}/5
                          </motion.span>
                        </div>
                        {order.review.comment && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                          >
                            <p className="text-sm text-gray-500 mb-1">Comment</p>
                            <p className="italic">"{order.review.comment}"</p>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  </FadeInWhenVisible>
                )}
              </div>
            </motion.div>
          </FadeInWhenVisible>

          {/* Right Column - Actions */}
          <FadeInWhenVisible delay={0.3} className="lg:col-span-1">
            <FloatingElement amount={5} speed={0.5}>
              <motion.div
                className="bg-white shadow-md rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)" }}
              >
                <motion.h3
                  className="text-lg font-semibold mb-4 border-b pb-2 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
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
                    <ClipboardList className="mr-2 h-5 w-5" />
                  </motion.div>
                  Actions
                </motion.h3>

                {/* Countdown Timer - add only if order has a due date */}
                {order.dueDate && (
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <CountdownTimer dueDate={order.dueDate} orderStatus={order.status} />
                  </motion.div>
                )}

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {user && isSameId(user.id, order.freelancerId) && order.status === "pending" && (
                    <MagneticButton strength={20}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button onClick={handleStartOrder} className="w-full">
                          Start Working
                        </Button>
                      </motion.div>
                    </MagneticButton>
                  )}

                  {user && isSameId(user.id, order.freelancerId) && order.status === "in_progress" && (
                    <Dialog open={showDeliverDialog} onOpenChange={setShowDeliverDialog}>
                      <DialogTrigger asChild>
                        <MagneticButton strength={20}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <Button className="w-full" onClick={() => setShowDeliverDialog(true)}>
                              <Upload className="mr-2 h-4 w-4" />
                              Deliver Work
                            </Button>
                          </motion.div>
                        </MagneticButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Deliver Work</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="file" className="text-right">
                              File
                            </label>
                            <Input
                              id="file"
                              type="file"
                              className="col-span-3"
                              onChange={(e) => {
                                if (e.target.files) {
                                  setFile(e.target.files[0])
                                  console.log("File selected:", e.target.files[0].name);
                                }
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="notes" className="text-right">
                              Notes
                            </label>
                            <Textarea
                              id="notes"
                              className="col-span-3"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={handleDeliverOrder} 
                          disabled={isDelivering}
                          className="w-full"
                        >
                          {isDelivering ? <Spinner /> : "Deliver"}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  )}

                  {user && isSameId(user.id, order.clientId) && order.status === "delivered" && (
                    <motion.div
                      className="flex justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <MagneticButton strength={20}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Button onClick={handleApproveDelivery} className="w-full">
                            Approve Delivery
                          </Button>
                        </motion.div>
                      </MagneticButton>
                      <MagneticButton strength={20}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Button variant="destructive" onClick={handleRejectDelivery} className="w-full">
                            Reject Delivery
                          </Button>
                        </motion.div>
                      </MagneticButton>
                    </motion.div>
                  )}

                  {user &&
                    ((isSameId(user.id, order.clientId) && order.status === "in_progress") ||
                      (isSameId(user.id, order.clientId) && order.isLate && order.status === "late")) && (
                      <Dialog open={showCancellationDialog} onOpenChange={setShowCancellationDialog}>
                        <DialogTrigger asChild>
                          <MagneticButton strength={20}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Button 
                                variant="destructive" 
                                className="w-full"
                                onClick={() => setShowCancellationDialog(true)}
                              >
                                Request Cancellation
                              </Button>
                            </motion.div>
                          </MagneticButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Request Cancellation</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="reason" className="text-right">
                                Reason
                              </label>
                              <Textarea
                                id="reason"
                                className="col-span-3"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={handleRequestCancellation} 
                            disabled={isCancelling}
                            className="w-full"
                          >
                            {isCancelling ? <Spinner /> : "Request Cancellation"}
                          </Button>
                        </DialogContent>
                      </Dialog>
                    )}
                </motion.div>
              </motion.div>
            </FloatingElement>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a Review</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rating" className="text-right">
                Rating
              </label>
              <div className="col-span-3 flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    className={`p-0 h-auto w-auto text-3xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                    onClick={() => setRating(star)}
                  >
                    <Star filled={star <= rating} className="h-6 w-6" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="comment" className="text-right">
                Comment
              </label>
              <Textarea
                id="comment"
                className="col-span-3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAddReview} disabled={isReviewing}>
            {isReviewing ? <Spinner /> : "Add Review"}
          </Button>
        </DialogContent>
      </Dialog>
      <Footer />
    </PageTransition>
  )
}
