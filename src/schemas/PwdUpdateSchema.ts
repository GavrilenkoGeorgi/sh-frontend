import { z } from 'zod'

export const PwdUpdateFormSchema = z.object({
  password: z.string().min(8).max(256),
  confirm: z.string().min(8).max(256),
  token: z.string().min(1)
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords don\'t match',
  path: ['confirm']
})

export type PwdResetFormSchemaType = z.infer<typeof PwdUpdateFormSchema>
