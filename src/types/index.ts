import { type ReactNode } from 'react'
import { type FieldErrors } from 'react-hook-form/dist/types'

// types
export type Nullable<T> = T | null

export type FocusedStates = Record<string, boolean>

export type InputValues = Record<string, string>

export type RegisterFormErrors = FieldErrors<{
  username: string
  email: string
  password: string
  confirm: string
}>

// interfaces
export interface IUser {
  _id: string
  name: string
  email: string
}

export interface AuthProviderProps {
  children: ReactNode
}

export interface IAuth {
  token: string | null
  setToken: (token: string) => void
}
