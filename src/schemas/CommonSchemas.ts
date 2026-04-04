import { string } from 'zod'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/

const requiredString = (fieldName: string) =>
  string({
    error: (issue) =>
      issue.input === undefined
        ? `${fieldName} is required`
        : `invalid ${fieldName}`
  })

export const passwordSchema = requiredString('password').regex(PASSWORD_REGEX, {
  error: '8-64 chars uppercase, lowercase, and a number'
})
