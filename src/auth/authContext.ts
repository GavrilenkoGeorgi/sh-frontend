import { createContext } from 'react'

export interface IAuth {
  token : string | null,
  setToken: (token: string) => void
}

export const AuthContext = createContext<IAuth | null>(null)
