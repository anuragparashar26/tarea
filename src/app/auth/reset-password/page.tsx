'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setSuccess(true)
      setTimeout(() => router.push('/auth/signin'), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
        Invalid reset link.{' '}
        <Link href="/auth/forgot-password" className="underline font-medium">Request a new one.</Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm text-center">
        Password updated! Redirecting to sign in...
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="password" className="text-black dark:text-white font-medium">
          New password
        </Label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-2 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-0"
          placeholder="At least 6 characters"
        />
      </div>

      <div>
        <Label htmlFor="confirm" className="text-black dark:text-white font-medium">
          Confirm password
        </Label>
        <PasswordInput
          id="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="mt-2 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-0"
          placeholder="Repeat your new password"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Set new password'}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
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
              Set new password
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a strong password for your account.
            </p>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8">
            <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
              <ResetPasswordForm />
            </Suspense>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/auth/signin" className="text-black dark:text-white font-medium hover:underline">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
