import PartnerController from '../controllers/partner.controller.js'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'

export const handlePartnerRoutes = async (req, res, pathname, method) => {
  if (pathname.startsWith('/api/partner')) {
    await authenticate(req, res)
    requireRole('Partner', 'Administrator')(req, res)

    if (pathname === '/api/partner/dashboard' && method === 'GET') {
      return await PartnerController.getDashboard(req, res)
    }

    if (pathname === '/api/partner/trainees' && method === 'GET') {
      return await PartnerController.getTrainees(req, res)
    }
  }

  return null
}

export default handlePartnerRoutes
