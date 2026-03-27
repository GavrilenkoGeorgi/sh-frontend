import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, { message: 'Must be at least 8 characters long' })
  .max(20, { message: 'Cannot exceed 20 characters' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Must contain at least one uppercase letter'
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Must contain at least one lowercase letter'
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Must contain at least one number'
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: 'Must contain at least one special character'
  })
