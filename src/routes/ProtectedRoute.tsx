import { type FC } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

import {
  selectIsAuthenticated,
  selectAuthInitialized
} from '../store/slices/authSlice'
import { ROUTES } from '../constants/routes'
import Fallback from '../components/layout/Fallback'

const ProtectedRoute: FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const authInitialized = useSelector(selectAuthInitialized)

  if (!authInitialized) return <Fallback />
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  return <Outlet />
}

export default ProtectedRoute
