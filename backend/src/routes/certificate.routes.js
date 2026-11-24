import db from '../db/index.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import AppError from '../utils/AppError.js'

export async function handleCertificateRoutes(req, res, pathname, method) {
  if (method !== 'GET') return null

  await authenticate(req, res)

  // GET /api/certificates — list user's certificates
  if (pathname === '/api/certificates') {
    const certs = await db.findMany('certificates', { userId: req.user.id }, { sort: { createdAt: -1 } })
    return { success: true, data: certs }
  }

  // GET /api/certificates/:id — single certificate detail
  const detailMatch = pathname.match(/^\/api\/certificates\/(.+)$/)
  if (detailMatch) {
    const certId = decodeURIComponent(detailMatch[1])
    const cert = await db.findById('certificates', certId)
      || await db.findOne('certificates', { credentialId: certId.toUpperCase() })
    if (!cert) throw new AppError('Certificate not found.', 404)
    if (cert.userId !== req.user.id) throw new AppError('Access denied.', 403)
    return { success: true, data: cert }
  }

  return null
}

export default handleCertificateRoutes
