import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full mb-6">
              <Shield className="h-8 w-8 text-gray-900 dark:text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Introduction
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Welcome to Tarea. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Information We Collect
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, or otherwise contact us.
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                    Personal Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Name and email address</li>
                    <li>Account credentials (username and password)</li>
                    <li>Profile information (if provided)</li>
                    <li>Notes and tasks you create within the application</li>
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    This data is stored in our application's database to provide you with the core features of Tarea.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We use the information we collect or receive:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>To facilitate account creation and authentication</li>
                  <li>To provide, operate, and maintain our application</li>
                  <li>To manage your notes and tasks</li>
                  <li>To send you administrative information</li>
                  <li>To improve and personalize your experience</li>
                  <li>To respond to your inquiries and support requests</li>
                  <li>We do not use your personal data, including your notes and tasks, for targeted advertising.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Data Security
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please note that no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Data Sovereignty and Self-Hosting
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  For users who prefer complete control over their data, Tarea is open-source. You can self-host the application and connect it to your own database. Instructions for setting up your own instance are available in the `README.md` file in our <a href="https://github.com/anuragparashar26/tarea" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">GitHub repository</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Data Retention
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We will retain your personal information only for as long as necessary for the purposes set out in this Privacy Policy. When you delete your account, we will delete your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Your Privacy Rights
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-black dark:text-white mb-2">Access and Update</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You can access and update your personal information through your profile settings.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-black dark:text-white mb-2">Delete Your Account</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You can delete your account and all associated data at any time through your profile settings.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Cookies and Tracking
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our application and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-black dark:text-white">Email:</span>
                    <a href="mailto:privacy@tarea.app" className="hover:underline">anuragp5025@gmail.com</a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Tarea. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
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
