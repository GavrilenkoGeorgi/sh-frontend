import React from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'

import App from '../App'
import MainPage from '../pages/Main'
import LoginPage from '../pages/Login'
import ProfilePage from '../pages/Profile'
import LogoutPage from '../components/Logout'
import GlobalStatsPage from '../pages/GlobalStats'
import RegisterPage from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<MainPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/logout' element={<LogoutPage />} />
      <Route path='' element={<ProtectedRoute />}>
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/global-stats' element={<GlobalStatsPage />} />
      </Route>
    </Route>
  )
)

export default router
