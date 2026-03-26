import { z } from 'zod'

export const RecoveryEmailSchema = z.object({
  // TODO: check for proper email format
  email: z.string().email().min(5).max(256)
})

export type RecoveryEmailSchemaType = z.infer<typeof RecoveryEmailSchema>
