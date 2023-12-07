import { z } from 'zod'

export const RegisterFormSchema = z.object({
  name: z.string().min(2).max(128),
  email: z.string().email().min(5).max(256),
  password: z.string().min(8).max(256),
  confirm: z.string().min(8).max(256)
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords don\'t match',
  path: ['confirm']
})

export type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>
