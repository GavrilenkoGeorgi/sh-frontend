import React, { type FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/authProvider'

export const ProtectedRoute: FC = () => {
  const authContext = useAuth()

  // Check if the user is authenticated
  if (authContext?.token == null) {
    return <Navigate to='/' />
  }
  // If authenticated, render the child routes
  return <Outlet />
}
