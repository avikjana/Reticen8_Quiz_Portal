import AdminController from '../controllers/admin.controller.js'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'

export const handleAdminRoutes = async (req, res, pathname, method) => {
  if (!pathname.startsWith('/api/admin')) return null

  await authenticate(req, res)
  requireRole('Administrator')(req, res)

  // --- Overview ---
  if (pathname === '/api/admin/overview' && method === 'GET') {
    return await AdminController.getOverview(req, res)
  }

  // --- Users ---
  if (pathname === '/api/admin/users' && method === 'GET') {
    return await AdminController.getUsers(req, res)
  }
  if (pathname === '/api/admin/users' && method === 'POST') {
    return await AdminController.createUser(req, res)
  }

  // DELETE /api/admin/users/:id
  const userDeleteMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)$/)
  if (userDeleteMatch && method === 'DELETE') {
    req.params = { id: decodeURIComponent(userDeleteMatch[1]) }
    return await AdminController.deleteUser(req, res)
  }

  // --- Courses ---
  if (pathname === '/api/admin/courses' && method === 'GET') {
    return await AdminController.getCourses(req, res)
  }
  if (pathname === '/api/admin/courses' && method === 'POST') {
    return await AdminController.createCourse(req, res)
  }

  // DELETE /api/admin/courses/:id
  const courseDeleteMatch = pathname.match(/^\/api\/admin\/courses\/([^/]+)$/)
  if (courseDeleteMatch && method === 'DELETE') {
    req.params = { courseId: decodeURIComponent(courseDeleteMatch[1]) }
    return await AdminController.deleteCourse(req, res)
  }

  // --- Enrollments (admin) ---
  // DELETE /api/admin/enrollments/:enrollmentId
  const enrollDeleteMatch = pathname.match(/^\/api\/admin\/enrollments\/([^/]+)$/)
  if (enrollDeleteMatch && method === 'DELETE') {
    req.params = { enrollmentId: decodeURIComponent(enrollDeleteMatch[1]) }
    return await AdminController.removeEnrollment(req, res)
  }

  return null
}

export default handleAdminRoutes
