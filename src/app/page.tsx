'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { StickyNote, CheckSquare, ArrowRight, Circle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  if (session) {
    redirect('/dashboard')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation */}
      <motion.nav
        className="border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
  <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src="/logo_blackbgrounded.png"
                alt="Tarea Logo"
                width={32}
                height={32}
                className="rounded-sm"
              />
              <span className="text-xl font-semibold tracking-tight">Tarea</span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </motion.div>
              </Link>
              <Link href="/auth/signin">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    Get Started
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="w-full text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-balance"
              variants={itemVariants}
            >
              Notes & Tasks.
              <br />
              <span className="text-gray-500 dark:text-gray-400">Simplified.</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 mx-auto text-balance"
              variants={itemVariants}
            >
              A minimal workspace for your notes and task management.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              <Link href="/auth/signin">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 py-4 text-lg font-medium"
                  >
                    Start Organizing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <motion.p
                className="text-sm text-gray-500 dark:text-gray-400"
                variants={itemVariants}
              >
                No credit card required
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Visual Demo */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative w-full">
              <motion.div
                className="absolute inset-0 from-transparent via-black/5 to-transparent dark:via-white/5 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              ></motion.div>
              <motion.div
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm max-w-4xl mx-auto"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Notes Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="flex items-center mb-4">
                      <StickyNote className="h-5 w-5 mr-2" />
                      <h3 className="font-semibold">Notes</h3>
                    </div>
                    <div className="space-y-3">
                      <motion.div
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">Project Ideas</h4>
                          <Circle className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Build a minimal note-taking app...</p>
                      </motion.div>
                      <motion.div
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">Meeting Notes</h4>
                          <Circle className="h-3 w-3 fill-blue-400 text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Discussed the quarterly roadmap...</p>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Tasks Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <div className="flex items-center mb-4">
                      <CheckSquare className="h-5 w-5 mr-2" />
                      <h3 className="font-semibold">Tasks</h3>
                    </div>
                    <div className="space-y-3">
                      <motion.div
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <h4 className="font-medium text-sm mb-3">Today</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded"></div>
                            <span className="text-sm">Review designs</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckSquare className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 line-through">Update documentation</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for simplicity</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to stay organized, nothing you don&apos;t.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="text-center"
              variants={featureVariants}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <StickyNote className="h-6 w-6 text-white dark:text-black" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">Smart Notes</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create, organize, and search through your notes with pinning and archiving.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              variants={featureVariants}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <CheckSquare className="h-6 w-6 text-white dark:text-black" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">Task Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize tasks with priorities, due dates, and custom lists.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              variants={featureVariants}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Circle className="h-6 w-6 text-white dark:text-black" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">Minimal Design</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Clean, distraction-free interface with aesthetic dark design.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get organized?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join users who have simplified their workflow with Tarea.
          </p>
          <Link href="/auth/signin">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 py-4 text-lg font-medium"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Free forever. No credit card required.
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="border-t border-gray-200 dark:border-gray-800 py-8 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <motion.div
            className="flex items-center space-x-3 mb-4 md:mb-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/logo_blackbgrounded.png"
              alt="Tarea Logo"
              width={28}
              height={28}
              className="rounded-sm"
            />
            <span className="font-medium">Tarea</span>
          </motion.div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/privacy-policy"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <p className="text-gray-500 dark:text-gray-400">
              © 2025 Tarea. Built by Anurag Parashar.
            </p>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  )
}