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
import RegisterPage from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'
import NavBar from '../components/navigation/NavBar'
import Fallback from '../components/layout/Fallback'
import Toast from '../components/layout/Toast'

// root
const MainPage = lazy(async () => await import('../pages/Main')) // s
// heaviest routes
const StatsPage = lazy(async () => await import('../pages/Stats'))
const GamePage = lazy(async () => await import('../pages/Game'))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<><NavBar /><App /><Toast /></>}>
      <Route index={true} path='/' element={
        <Suspense fallback={<Fallback />}>
          <MainPage />
        </Suspense>
      } />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/game' element={
        <Suspense fallback={<Fallback />}>
          <GamePage />
        </Suspense>
      } />
      <Route path='/help' element={<HelpPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route path='/stats' element={
        <Suspense fallback={<Fallback />}>
          <StatsPage />
        </Suspense>
      } />
      <Route path='' element={<ProtectedRoute />} >
        <Route path='/profile' element={<ProfilePage />} />
      </Route>

    </Route>
  )
)

export default router
