import AdminController from '../controllers/admin.controller.js'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'

export const handleAdminRoutes = async (req, res, pathname, method) => {
  if (pathname.startsWith('/api/admin')) {
    await authenticate(req, res)
    requireRole('Administrator')(req, res)

    if (pathname === '/api/admin/overview' && method === 'GET') {
      return await AdminController.getOverview(req, res)
    }

    if (pathname === '/api/admin/users' && method === 'GET') {
      return await AdminController.getUsers(req, res)
    }

    if (pathname === '/api/admin/users' && method === 'POST') {
      return await AdminController.createUser(req, res)
    }

    if (pathname.startsWith('/api/admin/users/') && method === 'DELETE') {
      const parts = pathname.split('/')
      req.params = { id: parts[parts.length - 1] }
      return await AdminController.deleteUser(req, res)
    }
  }

  return null
}

export default handleAdminRoutes
