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

  return null
}

export default handleAuthRoutes
