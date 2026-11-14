import CertificationModel from '../models/certification.model.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { rateLimit, clientIp } from '../utils/rateLimit.js'
import AppError from '../utils/AppError.js'

export const handleCertificationRoutes = async (req, res, pathname, method) => {
  if (method !== 'GET') return null

  // Public overview (home page cards)
  if (pathname === '/api/certifications') {
    return { success: true, data: CertificationModel.getAll().map(CertificationModel.toSummary) }
  }

  // Full certification guide — signed-in members only
  if (pathname === '/api/certifications/guide') {
    await authenticate(req, res)
    return { success: true, data: CertificationModel.getAll() }
  }

  // Public credential verification (e.g. for employers). Rate limited so
  // credential IDs can't be guessed in bulk.
  if (pathname.startsWith('/api/credentials/')) {
    rateLimit(`verify:ip:${clientIp(req)}`, { limit: 30 })
    const id = decodeURIComponent(pathname.replace('/api/credentials/', ''))
    const credential = CertificationModel.findCredential(id)
    if (!credential) {
      throw new AppError('No credential found with this ID. Check the ID and try again.', 404)
    }
    return { success: true, data: credential }
  }

  return null
}

export default handleCertificationRoutes
