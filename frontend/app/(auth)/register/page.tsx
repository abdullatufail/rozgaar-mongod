"use client"

import { RegisterForm } from "../../../components/auth/RegisterForm"
import { motion } from "framer-motion"
import { FadeInWhenVisible } from "@/components/animations/fade-in-when-visible"
import { TextReveal } from "@/components/animations/text-reveal"
import Link from "next/link"

export default function RegisterPage() {
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
            <TextReveal text={<h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>} />
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Enter your details below to create your account
            </motion.p>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.4}>
          <RegisterForm />
        </FadeInWhenVisible>

        <motion.div
          className="text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="underline hover:text-primary">
            Sign in
          </Link>
        </motion.div>
      </motion.div>

      
    </motion.div>
  )
}
