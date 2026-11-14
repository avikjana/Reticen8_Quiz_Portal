// Outgoing email. No provider is wired yet, so in development the message is
// logged to the server console (honest: nothing is actually delivered).
//
// To send real email, implement `deliver()` with your provider (e.g. nodemailer
// + SMTP, Resend, SES) and set the relevant env vars. Everything else stays.
const FROM = process.env.MAIL_FROM || 'Reticen8 Academy <no-reply@reticen8.com>'

async function deliver({ to, subject, text }) {
  // eslint-disable-next-line no-constant-condition
  if (!process.env.MAIL_PROVIDER) {
    console.log(
      `\n[email:dev] (no MAIL_PROVIDER set — not actually sent)\n  from: ${FROM}\n  to:   ${to}\n  subj: ${subject}\n  ${text.replace(/\n/g, '\n  ')}\n`
    )
    return
  }
  // TODO: integrate a real provider here.
  throw new Error(`MAIL_PROVIDER "${process.env.MAIL_PROVIDER}" is set but no delivery is implemented.`)
}

export function sendPasswordResetEmail(to, resetUrl) {
  return deliver({
    to,
    subject: 'Reset your Reticen8 Academy password',
    text: `We received a request to reset your password.\n\nReset it here (link expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
  })
}

export default { sendPasswordResetEmail }
