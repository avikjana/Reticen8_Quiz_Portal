import CustomerController from '../controllers/customer.controller.js'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'

export const handleCustomerRoutes = async (req, res, pathname, method) => {
  if (pathname.startsWith('/api/customer')) {
    await authenticate(req, res)
    requireRole('Customer', 'Administrator')(req, res)

    if (pathname === '/api/customer/dashboard' && method === 'GET') {
      return await CustomerController.getDashboard(req, res)
    }

    if (pathname === '/api/customer/enrollments' && method === 'GET') {
      return await CustomerController.getEnrollments(req, res)
    }
  }

  return null
}

export default handleCustomerRoutes
