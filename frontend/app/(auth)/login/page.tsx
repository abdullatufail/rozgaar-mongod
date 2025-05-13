"use client"

import { LoginForm } from "../../../components/auth/LoginForm"
import { motion } from "framer-motion"
import { FadeInWhenVisible } from "@/components/animations/fade-in-when-visible"
import { TextReveal } from "@/components/animations/text-reveal"
import Link from "next/link"

export default function LoginPage() {
  return (
    <motion.div
      className="container flex h-screen w-screen flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FadeInWhenVisible>
          <div className="flex flex-col space-y-2 text-center">
            <TextReveal text={<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>} />
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Enter your email to sign in to your account
            </motion.p>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.4}>
          <LoginForm />
        </FadeInWhenVisible>

        <motion.div
          className="text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="underline hover:text-primary">
            Sign up
          </Link>
        </motion.div>
      </motion.div>

      
    </motion.div>
  )
}
