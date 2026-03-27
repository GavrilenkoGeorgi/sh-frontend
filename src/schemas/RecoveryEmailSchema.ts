import { z } from 'zod'

export const RecoveryEmailSchema = z.object({
  email: z.email('Needs to be a valid email address')
})

export type RecoveryEmailSchemaType = z.infer<typeof RecoveryEmailSchema>
