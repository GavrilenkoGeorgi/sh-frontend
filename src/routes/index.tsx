import React, { Suspense, lazy } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'

import App from '../App'
import LoginPage from '../pages/Login'
import ProfilePage from '../pages/Profile'
import HelpPage from '../pages/Help'
import MainPage from '../pages/Main'
import RegisterPage from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'
import NavBar from '../components/navigation/NavBar'
import LoadingIndicator from '../components/layout/LoadingIndicator'

// heaviest routes
const StatsPage = lazy(async () => await import('../pages/Stats'))
const GamePage = lazy(async () => await import('../pages/Game'))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<><NavBar /><App /></>}>
      <Route index={true} path='/' element={<MainPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/game' element={
        <Suspense fallback={<LoadingIndicator />}>
          <GamePage />
        </Suspense>
      } />
      <Route path='/help' element={<HelpPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route path='' element={<ProtectedRoute />} >
        <Route path='/stats' element={
          <Suspense fallback={<LoadingIndicator />}>
            <StatsPage />
          </Suspense>
        } />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>

    </Route>
  )
)

export default router
