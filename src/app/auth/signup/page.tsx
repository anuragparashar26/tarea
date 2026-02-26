'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { StickyNote } from 'lucide-react'

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$%^&*-_=+,.?;:)', test: (p: string) => /[!@#$%^&*\-_=+,.?;:]/.test(p) },
]

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (/\s/.test(formData.password)) {
      setError('Password must not contain spaces.')
      return
    }
    const passwordValid = passwordRules.every(r => r.test(formData.password))
    if (!passwordValid) {
      setError('Password does not meet the requirements.')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess(true)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <StickyNote className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
              Check your email
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We sent a verification link to <span className="font-medium text-black dark:text-white">{formData.email}</span>. Click the link to activate your account, then sign in.
            </p>
            <div className="mt-6">
              <Link href="/auth/signin" className="text-sm font-medium text-black dark:text-white hover:underline">
                Go to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-2">
              Create account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get started with your notes and tasks
            </p>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-black dark:text-white font-medium">
                    Full name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-0"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-black dark:text-white font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-0"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-black dark:text-white font-medium">
                    Password
                  </Label>
                  <PasswordInput
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    required
                    className="mt-2 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-0"
                    placeholder="Create a password"
                    minLength={8}
                  />
                  {(passwordFocused || formData.password.length > 0) && (
                    <ul className="mt-2 space-y-1">
                      {passwordRules.map(rule => {
                        const passed = rule.test(formData.password)
                        return (
                          <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${
                            passed ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            <span>{passed ? '✓' : '○'}</span>
                            {rule.label}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
            </form>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-black dark:text-white font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-sm">
              <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Tarea. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}