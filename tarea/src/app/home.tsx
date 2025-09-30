'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { StickyNote, CheckSquare, ArrowRight } from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Tarea Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="text-2xl font-bold">Tarea</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signin">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Digital
            <span className="text-blue-600"> Workspace</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Combine the power of Google Keep-style notes with Microsoft To Do-style task management in one beautiful, fast, and secure application.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Organizing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-20">
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <StickyNote className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Smart Notes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create, organize, and search through your notes with drag-and-drop functionality, 
                color coding, and real-time search.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <CheckSquare className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Task Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize tasks with due dates, priorities, custom lists, and completion tracking 
                to stay productive and focused.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Features You&apos;ll Love</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div>✓ Real-time sync</div>
              <div>✓ Dark mode support</div>
              <div>✓ Drag & drop</div>
              <div>✓ Search everything</div>
              <div>✓ Google OAuth</div>
              <div>✓ Mobile responsive</div>
              <div>✓ Offline ready</div>
              <div>✓ Secure & private</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}