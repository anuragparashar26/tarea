import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 rounded-full blur-2xl opacity-50"></div>
            <div className="relative w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-800">
              <FileQuestion className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-black dark:text-white">404</h1>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Page not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve mistyped the URL or the page has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-gray-300 dark:border-gray-700"
          >
            <Link href="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help Links */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Need help? Here are some useful links:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link 
              href="/dashboard" 
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link 
              href="/auth/signin" 
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link 
              href="/privacy-policy" 
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Tarea. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
