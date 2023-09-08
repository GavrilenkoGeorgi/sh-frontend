import { type ReactNode } from 'react'

export type Nullable<T> = T | null

// export type State = ReturnType<typeof rootReducer>

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
