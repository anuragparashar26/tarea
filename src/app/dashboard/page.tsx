'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { StickyNote, CheckSquare, LogOut, User } from 'lucide-react'
import NotesManager from '@/components/notes/NotesManager'
import TasksManager from '@/components/tasks/TasksManager'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('notes')

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <motion.header 
        className="border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
  <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8 rounded-sm flex items-center justify-center"
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
              </motion.div>
              <motion.h1 
                className="text-xl font-semibold tracking-tight"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Tarea
              </motion.h1>
            </div>

            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <Link href="/profile" className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4" />
                    <span>{session.user?.name || session.user?.email}</span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
  <main className="w-full px-6 py-8 flex-1 min-h-0 relative overflow-hidden">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">

            {/* Floating switcher buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
              <button
                aria-label="Show Notes"
                onClick={() => setActiveTab('notes')}
                className={`h-12 w-12 rounded-full shadow-md flex items-center justify-center transition-colors border ${
                  activeTab === 'notes'
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
                title="Notes"
              >
                <StickyNote className="h-5 w-5" />
              </button>
              <button
                aria-label="Show Tasks"
                onClick={() => setActiveTab('tasks')}
                className={`h-12 w-12 rounded-full shadow-md flex items-center justify-center transition-colors border ${
                  activeTab === 'tasks'
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
                title="Tasks"
              >
                <CheckSquare className="h-5 w-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="notes" key="notes">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
                    <NotesManager />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="tasks" key="tasks" className="h-full">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <TasksManager />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}