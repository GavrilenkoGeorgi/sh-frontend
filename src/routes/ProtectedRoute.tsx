import React, { type FC } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

import { type RootState } from '../store'

const ProtectedRoute: FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)

  if (userInfo != null) {
    return <Outlet />
  } else return <Navigate to="/login" replace />
}

export default ProtectedRoute
