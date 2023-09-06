import { createContext } from 'react'
import type { Nullable, IAuth } from '../types'

export const AuthContext = createContext<Nullable<IAuth>>(null)
