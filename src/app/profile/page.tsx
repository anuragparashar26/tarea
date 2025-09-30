"use client"

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, Mail, Save, Trash2, User as UserIcon, Calendar } from 'lucide-react'

type ProfileFormState = {
	name: string
	email: string
}

type ProfileMeta = {
	createdAt?: string
	updatedAt?: string
}

export default function ProfilePage() {
	const router = useRouter()
	const { status, update } = useSession()
	const [formData, setFormData] = useState<ProfileFormState>({ name: '', email: '' })
	const [initialValues, setInitialValues] = useState<ProfileFormState>({ name: '', email: '' })
	const [meta, setMeta] = useState<ProfileMeta>({})
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [feedback, setFeedback] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	useEffect(() => {
		if (status === 'loading') {
			return
		}

		if (status === 'unauthenticated') {
			router.replace('/auth/signin')
			return
		}

		const controller = new AbortController()

		const loadProfile = async () => {
			setIsLoading(true)
			try {
				const response = await fetch('/api/user/profile', {
					cache: 'no-store',
					signal: controller.signal,
				})

				if (!response.ok) {
					throw new Error('Failed to fetch profile')
				}

				const { user } = await response.json()
				const name = user.name ?? ''
				const email = user.email ?? ''

				setFormData({ name, email })
				setInitialValues({ name, email })
				setMeta({ createdAt: user.createdAt, updatedAt: user.updatedAt })
				setError(null)
			} catch (err) {
				if ((err as Error).name === 'AbortError') {
					return
				}
				console.error('Profile fetch error:', err)
				setError('Unable to load profile. Please try again later.')
			} finally {
				setIsLoading(false)
			}
		}

		loadProfile()

		return () => controller.abort()
	}, [status, router])

	const hasChanges = useMemo(() => {
		return (
			formData.name.trim() !== initialValues.name.trim() ||
			formData.email.trim().toLowerCase() !== initialValues.email.trim().toLowerCase()
		)
	}, [formData, initialValues])

	const formattedCreatedAt = useMemo(() => {
		if (!meta.createdAt) return null
		return new Date(meta.createdAt).toLocaleDateString()
	}, [meta.createdAt])

	const formattedUpdatedAt = useMemo(() => {
		if (!meta.updatedAt) return null
		return new Date(meta.updatedAt).toLocaleString()
	}, [meta.updatedAt])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setFeedback(null)
		setError(null)

		const payload: Partial<ProfileFormState> = {}

		if (formData.name.trim() !== initialValues.name.trim()) {
			payload.name = formData.name.trim()
		}

		if (formData.email.trim().toLowerCase() !== initialValues.email.trim().toLowerCase()) {
			payload.email = formData.email.trim()
		}

		if (Object.keys(payload).length === 0) {
			setFeedback('No changes to save.')
			return
		}

		setIsSaving(true)

		try {
			const response = await fetch('/api/user/profile', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			})

			if (!response.ok) {
				if (response.status === 409) {
					setError('That email is already associated with another account.')
					return
				}

				const errorBody = await response.json().catch(() => null)
				const errorMessage = errorBody?.error ?? 'Failed to update profile.'
				setError(errorMessage)
				return
			}

			const { user } = await response.json()

			const nextValues = {
				name: user.name ?? '',
				email: user.email ?? '',
			}

			setInitialValues(nextValues)
			setFormData(nextValues)
			setMeta(prev => ({ ...prev, updatedAt: user.updatedAt }))
			setFeedback('Profile updated successfully.')

			if (update) {
				await update({
					name: nextValues.name,
					email: nextValues.email,
				})
			}
		} catch (err) {
			console.error('Profile update error:', err)
			setError('Something went wrong. Please try again later.')
		} finally {
			setIsSaving(false)
		}
	}

	const handleDeleteAccount = async () => {
		setIsDeleting(true)
		setError(null)

		try {
			const response = await fetch('/api/user/delete', {
				method: 'DELETE',
			})

			if (!response.ok) {
				const errorBody = await response.json().catch(() => null)
				const errorMessage = errorBody?.error ?? 'Failed to delete account.'
				setError(errorMessage)
				return
			}

			setIsDeleteDialogOpen(false)
			await signOut({ callbackUrl: '/' })
		} catch (err) {
			console.error('Account deletion error:', err)
			setError('Unable to delete account. Please try again later.')
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<div className="min-h-screen bg-white dark:bg-black">
			<div className="w-full px-6 py-12">
				<div className="mb-10">
					<h1 className="text-3xl font-semibold tracking-tight mb-2">Profile</h1>
					<p className="text-sm text-muted-foreground">
						Manage your personal information and account preferences.
					</p>
				</div>

				{isLoading ? (
					<div className="flex h-40 items-center justify-center">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : (
					<div className="space-y-10">
						<section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/40 p-6 shadow-sm">
							<header className="mb-6 flex items-center space-x-3">
								<div className="rounded-md bg-primary/10 p-2 text-primary">
									<UserIcon className="h-5 w-5" />
								</div>
								<div>
									<h2 className="text-lg font-semibold">Personal information</h2>
									<p className="text-sm text-muted-foreground">
										Update your name and email address.
									</p>
								</div>
							</header>

							<form className="space-y-6" onSubmit={handleSubmit}>
								<div className="grid gap-6 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<div className="relative">
											<Input
												id="name"
												name="name"
												placeholder="Your name"
												value={formData.name}
												onChange={event =>
													setFormData(prev => ({ ...prev, name: event.target.value }))
												}
											/>
											<UserIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<div className="relative">
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="you@example.com"
												value={formData.email}
												onChange={event =>
													setFormData(prev => ({ ...prev, email: event.target.value }))
												}
											/>
											<Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="text-xs text-muted-foreground space-y-1">
										{formattedCreatedAt && (
											<div className="flex items-center space-x-2">
												<Calendar className="h-3.5 w-3.5" />
												<span>Joined on {formattedCreatedAt}</span>
											</div>
										)}
										{formattedUpdatedAt && (
											<div>Last updated {formattedUpdatedAt}</div>
										)}
									</div>
									<Button type="submit" disabled={isSaving || !hasChanges}>
										{isSaving ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Saving
											</>
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												Save changes
											</>
										)}
									</Button>
								</div>
							</form>

							{feedback && (
								<p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
									{feedback}
								</p>
							)}
						</section>

						<section className="rounded-xl border border-red-200/60 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 p-6 shadow-sm">
							<header className="mb-4 flex items-center space-x-3">
								<div className="rounded-md bg-red-500/10 p-2 text-red-600 dark:text-red-400">
									<Trash2 className="h-5 w-5" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
										Delete account
									</h2>
									<p className="text-sm text-red-600/70 dark:text-red-300/80">
										Permanently remove your account and all associated data.
									</p>
								</div>
							</header>

							<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
								<DialogTrigger asChild>
									<Button variant="destructive" className="mt-2">
										Delete account
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Delete your account?</DialogTitle>
										<DialogDescription>
											This action can&rsquo;t be undone. All notes, task lists, and tasks will be permanently removed.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter className="sm:space-x-2 sm:space-y-0 space-y-2">
										<Button
											variant="outline"
											onClick={() => setIsDeleteDialogOpen(false)}
											disabled={isDeleting}
										>
											Cancel
										</Button>
										<Button
											variant="destructive"
											onClick={handleDeleteAccount}
											disabled={isDeleting}
										>
											{isDeleting ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Deleting…
												</>
											) : (
												'Delete permanently'
											)}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</section>

						{error && (
							<div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-600 dark:text-red-300">
								{error}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
