// Request-body schemas. Shape, length, and format live here; domain rules
// (duplicate email, role permissions, password verification) stay in the
// controllers. See validate.middleware.js for how these are applied.
import { z } from 'zod'

const email = z
  .string({ required_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .max(254)
  .email('Please enter a valid email address.')

// At least 8 chars, with a letter and a number (mirrors the old rule).
const strongPassword = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long.')
  .max(128, 'Password must be at most 128 characters long.')
  .refine((p) => /[a-zA-Z]/.test(p) && /\d/.test(p), 'Password must contain at least one letter and one number.')

const name = z.string({ required_error: 'Name is required' }).trim().min(1, 'Name is required').max(80)
const optionalText = z.string().trim().max(120).optional()
const role = z.enum(['Administrator', 'Employee', 'Partner'])

export const loginSchema = z.object({
  email,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  role: z.string().optional(),
})

export const registerSchema = z.object({
  name,
  email,
  password: strongPassword,
  role: role.optional().default('Employee'),
  roleTitle: optionalText,
  department: optionalText,
})

export const googleSchema = z.object({
  credential: z.string({ required_error: 'Missing Google credential.' }).min(1, 'Missing Google credential.'),
  role: z.string().optional(),
})

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Reset token is required.' }).min(1, 'Reset token is required.'),
  password: strongPassword,
})

export const adminCreateUserSchema = z.object({
  name,
  email,
  password: strongPassword,
  role: role.default('Employee'),
  roleTitle: optionalText,
  department: optionalText,
})
