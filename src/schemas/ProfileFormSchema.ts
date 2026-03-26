import { z } from 'zod'

export const ProfileFormSchema = z.object({
  name: z.string().refine((val) => val.length >= 2 && val.length <= 128, {
    message: 'Name must be between 2 and 128 characters'
  }),
  email: z.string().email().min(5).max(256)
})

export type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>
