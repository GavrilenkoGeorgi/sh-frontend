import { z } from 'zod'

export const ProfileFormSchema = z.object({
  name: z.string().min(2).max(128),
  email: z.string().email().min(5).max(256)
})

export type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>
