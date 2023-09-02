import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useAuth } from '../auth/authProvider'
import { ProtectedRoute } from './ProtectedRoute'

import MainPage from '../pages/MainPage'

const Routes = () => {

  const publicRoutes = [
    {
      path: '/',
      element: <MainPage/>
    },
    {
      path: '/help',
      element: <div>Help public</div>
    }
  ]

  const authOnlyRoutes = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/stats',
          element: <div>Stats</div>
        }
      ]
    }
  ]

  /* const noAuthRoutes = [
    {
      path: '/help-2',
      element: <div>Help noAuthRoutes</div>
    }
  ] */

  const authContext = useAuth()

  // Compile routes into this:
  const router = createBrowserRouter([
    ...publicRoutes,
    // ...(!authContext?.token ? noAuthRoutes : []), // token check looks strange
    ...authOnlyRoutes,
  ])

  return <RouterProvider router={router} />
}

export default Routes
