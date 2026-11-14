// Minimal structured request logger. One line per request:
//   2026-11-14T19:40:12.345Z  POST /api/auth/login        200  12ms
// Set LOG_LEVEL=silent to turn it off (e.g. in tests).
const SILENT = process.env.LOG_LEVEL === 'silent'

const colour = (status) => {
  if (!process.stdout.isTTY) return (s) => s
  const code = status >= 500 ? 31 : status >= 400 ? 33 : 32 // red / yellow / green
  return (s) => `\x1b[${code}m${s}\x1b[0m`
}

export function logRequest(req, res) {
  if (SILENT) return
  const start = process.hrtime.bigint()
  res.once('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6
    const status = res.statusCode
    const line = `${new Date().toISOString()}  ${req.method.padEnd(6)} ${req.url.padEnd(34)} ${colour(status)(status)}  ${ms.toFixed(0)}ms`
    console.log(line)
  })
}

export default { logRequest }
