import { z } from 'zod'

import { passwordSchema } from './CommonSchemas'

export const LoginFormSchema = z.object({
  email: z.email('Needs to be a valid email address'),
  password: passwordSchema
})

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>
