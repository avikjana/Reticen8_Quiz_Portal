import UserController from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

export const handleUserRoutes = async (req, res, pathname, method) => {
  if (pathname.startsWith('/api/users')) {
    await authenticate(req, res)

    if (pathname === '/api/users/profile' && method === 'GET') {
      return await UserController.getProfile(req, res)
    }

    if (pathname === '/api/users/profile' && method === 'PUT') {
      return await UserController.updateProfile(req, res)
    }
  }

  return null
}

export default handleUserRoutes
