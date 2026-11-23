import AppError from '../utils/AppError.js'

export const errorHandler = (err, req, res) => {
  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal Server Error'

  if (!err.isOperational) {
    console.error(`[Error] ${statusCode} - ${message}`, err)
  }

  if (res.headersSent) return

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': res.corsOrigin || '*',
    Vary: 'Origin',
  })

  const body = { success: false, error: message }
  if (err.details) body.details = err.details
  res.end(JSON.stringify(body))
}

export default errorHandler
