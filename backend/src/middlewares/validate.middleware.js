import AppError from '../utils/AppError.js'

// Parse and validate a request body against a zod schema. Returns the cleaned,
// typed value, or throws a 400 AppError whose message is the first problem and
// whose `details` lists every field error (handy for the client).
export function validate(schema, body) {
  const result = schema.safeParse(body || {})
  if (result.success) return result.data
  const issues = result.error.issues
  const details = issues.map((i) => ({ field: i.path.join('.') || '(body)', message: i.message }))
  throw new AppError(issues[0]?.message || 'Invalid request.', 400, { fields: details })
}

export default { validate }
