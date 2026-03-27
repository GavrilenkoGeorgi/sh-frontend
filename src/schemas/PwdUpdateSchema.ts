import { z } from 'zod'
import { passwordSchema } from './CommonSchemas'

export const PwdUpdateFormSchema = z
  .object({
    password: passwordSchema,
    confirm: passwordSchema,
    token: z.string().min(1) // TODO: consider adding better validation for token
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm']
  })

export type PwdUpdateFormSchemaType = z.infer<typeof PwdUpdateFormSchema>
