import { z } from 'zod'

export const ProfileFormSchema = z.object({
  name: z.string().refine((val) => val.length >= 2 && val.length <= 128, {
    message: 'Name must be between 2 and 128 characters'
  }),
  email: z.email('Needs to be a valid email address')
})

export type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>
