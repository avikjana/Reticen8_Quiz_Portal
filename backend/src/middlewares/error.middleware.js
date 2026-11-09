import AppError from '../utils/AppError.js'

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  console.error(`[Error] ${statusCode} - ${message}`, err.details || '')

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })

  res.end(
    JSON.stringify({
      success: false,
      error: message,
      details: err.details || null,
      timestamp: new Date().toISOString(),
    })
  )
}

export default errorHandler
