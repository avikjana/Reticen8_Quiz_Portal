import AuthController from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

export const handleAuthRoutes = async (req, res, pathname, method) => {
  if (pathname === '/api/auth/login' && method === 'POST') {
    return await AuthController.login(req, res)
  }

  if (pathname === '/api/auth/register' && method === 'POST') {
    return await AuthController.register(req, res)
  }

  if (pathname === '/api/auth/google' && method === 'POST') {
    return await AuthController.googleLogin(req, res)
  }

  if (pathname === '/api/auth/forgot-password' && method === 'POST') {
    return await AuthController.forgotPassword(req, res)
  }

  if (pathname === '/api/auth/reset-password' && method === 'POST') {
    return await AuthController.resetPassword(req, res)
  }

  if (pathname === '/api/auth/roles' && method === 'GET') {
    return await AuthController.getRoles(req, res)
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    await authenticate(req, res)
    return await AuthController.getMe(req, res)
  }

  if (pathname === '/api/auth/logout' && method === 'POST') {
    return await AuthController.logout(req, res)
  }

  // --- MFA routes ---

  // Complete login with TOTP code (no auth — uses short-lived mfaToken)
  if (pathname === '/api/auth/mfa/verify' && method === 'POST') {
    return await AuthController.mfaVerifyLogin(req, res)
  }

  // Begin MFA setup (requires auth)
  if (pathname === '/api/auth/mfa/setup' && method === 'POST') {
    await authenticate(req, res)
    return await AuthController.mfaSetup(req, res)
  }

  // Confirm MFA setup with a TOTP code (requires auth)
  if (pathname === '/api/auth/mfa/verify-setup' && method === 'POST') {
    await authenticate(req, res)
    return await AuthController.mfaVerifySetup(req, res)
  }

  // Disable MFA (requires auth + password)
  if (pathname === '/api/auth/mfa/disable' && method === 'POST') {
    await authenticate(req, res)
    return await AuthController.mfaDisable(req, res)
  }

  // Check MFA status (requires auth)
  if (pathname === '/api/auth/mfa/status' && method === 'GET') {
    await authenticate(req, res)
    return await AuthController.mfaStatus(req, res)
  }

  // Regenerate backup codes (requires auth + TOTP)
  if (pathname === '/api/auth/mfa/backup-codes' && method === 'POST') {
    await authenticate(req, res)
    return await AuthController.mfaRegenerateBackupCodes(req, res)
  }

  return null
}

export default handleAuthRoutes
