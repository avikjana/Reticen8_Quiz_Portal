import AppError from '../utils/AppError.js'

export const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missing = []
    for (const field of requiredFields) {
      if (!req.body || req.body[field] === undefined || req.body[field] === '') {
        missing.push(field)
      }
    }
    if (missing.length > 0) {
      throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400, { missing })
    }
    if (next) next()
  }
}

export default { validateBody }
