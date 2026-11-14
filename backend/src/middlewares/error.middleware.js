import AppError from '../utils/AppError.js'

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  // Don't leak internal error details for unexpected (non-AppError) failures
  const message = err.isOperational ? err.message : 'Internal Server Error'

  console.error(`[Error] ${statusCode} - ${message}`, err.isOperational ? err.details || '' : err)

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': res.corsOrigin || '*',
    Vary: 'Origin',
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
