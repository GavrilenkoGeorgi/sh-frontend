import { z } from 'zod'

export const RegisterFormSchema = z.object({
  username: z.string().min(2).max(128),
  email: z.string().email().min(5).max(128),
  password: z.string().min(2).max(128),
  confirm: z.string().min(2).max(128)
})

export type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>
