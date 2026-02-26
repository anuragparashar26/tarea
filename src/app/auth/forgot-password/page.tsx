'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo_blackbgrounded.png"
              alt="Tarea Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="text-xl font-semibold tracking-tight">Tarea</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-2">
              Forgot password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm">
                  If an account with that email exists, we sent a password reset link. Check your inbox.
                </div>
                <Link href="/auth/signin" className="text-sm font-medium text-black dark:text-white hover:underline">
                  Back to sign in
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-black dark:text-white font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-0"
                    placeholder="Enter your email"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link href="/auth/signin" className="text-black dark:text-white font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
