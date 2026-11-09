import EmployeeController from '../controllers/employee.controller.js'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'

export const handleEmployeeRoutes = async (req, res, pathname, method) => {
  if (pathname.startsWith('/api/employee')) {
    await authenticate(req, res)
    requireRole('Employee', 'Administrator')(req, res)

    if (pathname === '/api/employee/dashboard' && method === 'GET') {
      return await EmployeeController.getDashboard(req, res)
    }

    if (pathname === '/api/employee/enrollments' && method === 'GET') {
      return await EmployeeController.getEnrollments(req, res)
    }
  }

  return null
}

export default handleEmployeeRoutes
