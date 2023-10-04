import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().email().min(5).max(128),
  password: z.string().min(2).max(128)
})

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
