import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().email().min(5).max(256),
  password: z.string().min(3).max(256)
})

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
