// Verifies Google ID tokens ("credential") produced by Google Identity Services
// on the frontend. Uses Google's official library, which checks the signature
// against Google's rotating public keys, the issuer, the audience and expiry.
import { OAuth2Client } from 'google-auth-library'
import AppError from './AppError.js'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID)

export async function verifyGoogleCredential(credential) {
  if (!CLIENT_ID) {
    throw new AppError('Google sign-in is not configured on the server (GOOGLE_CLIENT_ID missing).', 503)
  }
  if (!credential || typeof credential !== 'string') {
    throw new AppError('Missing Google credential.', 400)
  }

  let payload
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: CLIENT_ID })
    payload = ticket.getPayload()
  } catch {
    throw new AppError('Google sign-in failed: the token is invalid or expired.', 401)
  }

  if (!payload?.email || payload.email_verified !== true) {
    throw new AppError('Your Google account email is not verified.', 401)
  }

  // Optional: restrict Google sign-in to specific Workspace domains, e.g. "reticen8.com"
  const allowed = (process.env.GOOGLE_ALLOWED_DOMAINS || '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean)
  if (allowed.length) {
    const domain = (payload.hd || payload.email.split('@')[1] || '').toLowerCase()
    if (!allowed.includes(domain)) {
      throw new AppError('This Google account is not permitted to sign in.', 403)
    }
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture || null,
  }
}
