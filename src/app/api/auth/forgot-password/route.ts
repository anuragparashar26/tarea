import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return NextResponse.json({
        message: 'If an account with that email exists, we sent a password reset link.'
      })
    }

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000)
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expires }
    })

    sendPasswordResetEmail(email, token).catch(err => {
      console.error('Failed to send password reset email to', email)
      console.error('Mailgun error:', JSON.stringify(err, null, 2))
      console.error('MAILGUN_DOMAIN:', process.env.MAILGUN_DOMAIN)
      console.error('EMAIL_FROM:', process.env.EMAIL_FROM)
      console.error('MAILGUN_API_KEY set:', !!process.env.MAILGUN_API_KEY)
    })

    return NextResponse.json({
      message: 'If an account with that email exists, we sent a password reset link.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
