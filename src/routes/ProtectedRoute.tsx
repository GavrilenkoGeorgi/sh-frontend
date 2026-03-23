import React, { type FC } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

import {
  selectIsAuthenticated,
  selectAuthInitialized
} from '../store/slices/authSlice'

const ProtectedRoute: FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const authInitialized = useSelector(selectAuthInitialized)

  if (!authInitialized) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

export default ProtectedRoute
