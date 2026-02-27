'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { LogOut, User, StickyNote, CheckSquare } from 'lucide-react'
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
    <div className="h-screen bg-white dark:bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header 
        className="border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
  <div className="w-full px-4 py-3 md:px-6 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 md:space-x-3">
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
                className="text-lg md:text-xl font-semibold tracking-tight"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Tarea
              </motion.h1>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Tab switcher */}
              <motion.div
                className="flex items-center rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 text-sm transition-colors ${
                    activeTab === 'notes'
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <StickyNote className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Notes</span>
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 text-sm transition-colors ${
                    activeTab === 'tasks'
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <CheckSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Tasks</span>
                </button>
              </motion.div>
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-gray-100 dark:hover:bg-gray-900 px-2 md:px-3"
                >
                  <Link href="/profile" className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden md:inline">{session.user?.name || session.user?.email}</span>
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
                  className="hover:bg-gray-100 dark:hover:bg-gray-900 px-2 md:px-3"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline ml-2">Sign Out</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className={`w-full flex-1 min-h-0 flex flex-col overflow-hidden ${activeTab === 'tasks' ? '' : 'px-6 py-8'}`}>
        <motion.div
          className="flex-1 min-h-0 flex flex-col"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">

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

              <TabsContent value="tasks" key="tasks" className="flex-1 min-h-0 mt-0">
                <motion.div
                  className="h-full"
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