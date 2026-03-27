import { z } from 'zod'
import { passwordSchema } from './CommonSchemas'

export const RegisterFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Must be at least 2 characters long' })
      .max(128, { message: 'Cannot exceed 128 characters' }),
    email: z.email('Needs to be a valid email address'),
    password: passwordSchema,
    confirm: passwordSchema
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm']
  })

export type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>
