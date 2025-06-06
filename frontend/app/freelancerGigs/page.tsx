"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"
import { Gig, deleteGig, getGigs } from "../../services/gigs"
import { Button } from "../../components/ui/button"
import { useToast } from "../../components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { Edit, Plus, Star, Trash2 } from 'lucide-react'
import { Navbar } from "../../components/common/Navbar"
import { PageTransition } from "../../components/animations"
import { motion, AnimatePresence } from "framer-motion"

// Import advanced animation components
import { FadeInWhenVisible } from "@/components/animations/fade-in-when-visible"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { ScrollProgressIndicator } from "@/components/animations/scroll-progress-indicator"
import { TextReveal } from "@/components/animations/text-reveal"

export default function FreelancerGigsPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useAuth()
  const { toast } = useToast()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      if (user.role !== "freelancer") {
        router.push("/dashboard")
        return
      }
      fetchGigs()
    }
  }, [user, router])

  const fetchGigs = async () => {
    try {
      setLoading(true)

      if (!user || !user.id) {
        console.error("No user available for fetching gigs")
        return
      }

      // Call the API to get all gigs
      const allGigs = await getGigs()
      console.log("API response for gigs:", allGigs)

      // Ensure allGigs is an array before filtering
      const gigsArray = Array.isArray(allGigs) ? allGigs : []

      if (gigsArray.length === 0) {
        console.log("No gigs returned from API")
        setGigs([])
        return
      }

      // Filter gigs for the current user
      const myGigs = gigsArray.filter((gig) => {
        if (!gig || !gig.freelancerId) return false

        console.log(`Comparing freelancerId: "${gig.freelancerId}" with userId: "${user.id}"`)

        // Compare strings to avoid type issues
        return String(gig.freelancerId) === String(user.id)
      })

      console.log(`Found ${myGigs.length} gigs for current user`)
      setGigs(myGigs)
    } catch (error) {
      console.error("Error fetching gigs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your gigs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGig = async (id: string) => {
    try {
      await deleteGig(id)
      toast({
        title: "Success",
        description: "Gig deleted successfully",
      })
      fetchGigs()
    } catch (error) {
      console.error("Error deleting gig:", error)
      toast({
        title: "Error",
        description: "Failed to delete gig",
        variant: "destructive",
      })
    }
  }

  if (userLoading) {
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

  if (!user) {
    router.push("/login")
    return null
  }

  if (user.role !== "freelancer") {
    router.push("/dashboard")
    return null
  }

  return (
    <PageTransition>
      {/* Progress bar */}
      <ScrollProgressIndicator />

      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <FadeInWhenVisible>
          <div className="flex items-center justify-between mb-8">
            <TextReveal text={<h1 className="text-3xl font-bold">My Gigs</h1>} />
            <div className="flex space-x-2">
              <MagneticButton strength={30}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button onClick={fetchGigs} variant="outline">
                    Refresh
                  </Button>
                </motion.div>
              </MagneticButton>
              <MagneticButton strength={30}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link href="/freelancerGigs/create">
                    <Button>
                      <motion.div
                        animate={{ rotate: [0, 180] }}
                        transition={{
                          duration: 0.5,
                          repeat: 0,
                          repeatType: "reverse",
                          ease: "easeInOut",
                          repeatDelay: 5,
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                      </motion.div>
                      Create New Gig
                    </Button>
                  </Link>
                </motion.div>
              </MagneticButton>
            </div>
          </div>
        </FadeInWhenVisible>

        {loading ? (
          <div className="flex justify-center my-8">
            <motion.div
              className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : gigs.length === 0 ? (
          <FadeInWhenVisible delay={0.2}>
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">You haven't created any gigs yet</h2>
              <p className="text-muted-foreground mb-6">Start by creating your first gig to showcase your services</p>
              <MagneticButton strength={30}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link href="/freelancerGigs/create">
                    <Button>
                      <motion.div
                        animate={{ rotate: [0, 180] }}
                        transition={{
                          duration: 0.5,
                          repeat: 0,
                          repeatType: "reverse",
                          ease: "easeInOut",
                          repeatDelay: 5,
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                      </motion.div>
                      Create Your First Gig
                    </Button>
                  </Link>
                </motion.div>
              </MagneticButton>
            </motion.div>
          </FadeInWhenVisible>
        ) : (
          <FadeInWhenVisible delay={0.3}>
            <motion.div
              className="overflow-x-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {gigs.map((gig, index) => (
                      <motion.tr
                        key={gig.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group"
                      >
                        <TableCell>
                          <motion.div
                            className="relative h-12 w-20 overflow-hidden rounded"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <Image src={gig.image || "/placeholder.svg"} alt={gig.title} fill className="object-cover" />
                          </motion.div>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          <Link href={`/gigs/${gig.id}`} className="hover:underline">
                            {gig.title}
                          </Link>
                        </TableCell>
                        <TableCell>{gig.category}</TableCell>
                        <TableCell>${gig.price}</TableCell>
                        <TableCell>{gig.durationDays} days</TableCell>
                        <TableCell>
                          <div className="flex items-center">
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
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            </motion.div>
                            <span>{gig.rating || 0}</span>
                            {gig.totalReviews && gig.totalReviews > 0 && (
                              <span className="text-muted-foreground text-xs ml-1">({gig.totalReviews})</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDistanceToNow(new Date(gig.createdAt))} ago</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <MagneticButton strength={20}>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              >
                                <Link href={`/freelancerGigs/${gig.id}/edit`}>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </motion.div>
                            </MagneticButton>
                            <MagneticButton strength={20}>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Gig</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this gig? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteGig(gig.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </MagneticButton>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </motion.div>
          </FadeInWhenVisible>
        )}
      </div>
    </PageTransition>
  )
}
