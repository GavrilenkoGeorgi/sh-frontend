import React, { FC, useContext, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import { AuthProviderProps } from '../types'

const AuthProvider:FC<AuthProviderProps> = ({ children }) => {

  const [token, setToken_] = useState(localStorage.getItem('token'))
  const setToken = (newToken: string) => {
    setToken_(newToken)
  }

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider
