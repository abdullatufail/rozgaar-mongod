"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MagneticButton } from "../animations/magnetic-button"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { user, logout } = useAuth()
  
  return (
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
  )
}
