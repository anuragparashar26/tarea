import Mailgun from 'mailgun.js'
import FormData from 'form-data'

const mailgun = new Mailgun(FormData)

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
  // For EU region uncomment: url: 'https://api.eu.mailgun.net',
})

const DOMAIN = process.env.MAILGUN_DOMAIN!
const FROM = process.env.EMAIL_FROM ?? `Tarea <noreply@${DOMAIN}>`
const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${APP_URL}/api/auth/verify-email?token=${token}`

  await mg.messages.create(DOMAIN, {
    from: FROM,
    to: [email],
    subject: 'Verify your Tarea account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#111">Verify your email</h2>
        <p>Thanks for signing up for Tarea! Click the button below to verify your email address.</p>
        <a href="${link}"
           style="display:inline-block;padding:12px 24px;background:#111;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">
          Verify email
        </a>
        <p style="color:#666;font-size:13px">This link expires in 24 hours. If you did not create an account, you can safely ignore this email.</p>
        <p style="color:#666;font-size:13px">Or copy this URL: ${link}</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${APP_URL}/auth/reset-password?token=${token}`

  await mg.messages.create(DOMAIN, {
    from: FROM,
    to: [email],
    subject: 'Reset your Tarea password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#111">Reset your password</h2>
        <p>We received a request to reset the password for your Tarea account. Click the button below to choose a new password.</p>
        <a href="${link}"
           style="display:inline-block;padding:12px 24px;background:#111;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">
          Reset password
        </a>
        <p style="color:#666;font-size:13px">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
        <p style="color:#666;font-size:13px">Or copy this URL: ${link}</p>
      </div>
    `,
  })
}
