import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        if (
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/profile') ||
          pathname.startsWith('/api/notes') ||
          pathname.startsWith('/api/tasks') ||
          pathname.startsWith('/api/user')
        ) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/notes/:path*',
    '/api/tasks/:path*',
    '/api/user/:path*',
  ]
}