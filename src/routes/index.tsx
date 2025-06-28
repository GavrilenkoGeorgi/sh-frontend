import React, { Suspense, lazy } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router'

import App from '../App'
import { ROUTES } from '../constants/routes'
import LoginPage from '../pages/Login'
import ProfilePage from '../pages/Profile'
import HelpPage from '../pages/Help'
import RegisterPage from '../pages/Register'
import PasswordPage from '../pages/Password'
import PrivacyPage from '../pages/Privacy'
import DeleteAccountPage from '../pages/DeleteAccount'
import ClearStatsPage from '../pages/ClearStats'
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
    <Route
      path="/"
      element={
        <>
          <NavBar />
          <App />
          <Toast />
        </>
      }
    >
      <Route
        index={true}
        path={ROUTES.HOME}
        element={
          <Suspense fallback={<Fallback />}>
            <MainPage />
          </Suspense>
        }
      />

      <Route
        path={ROUTES.GAME}
        element={
          <Suspense fallback={<Fallback />}>
            <GamePage />
          </Suspense>
        }
      />

      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.HELP} element={<HelpPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<PasswordPage />} />
      <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
      <Route path={ROUTES.DELETE_ACCOUNT} element={<DeleteAccountPage />} />
      <Route path={ROUTES.CLEAR_STATS} element={<ClearStatsPage />} />

      <Route path="" element={<ProtectedRoute />}>
        <Route
          path={ROUTES.STATS}
          element={
            <Suspense fallback={<Fallback />}>
              <StatsPage />
            </Suspense>
          }
        />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Route>
    </Route>
  )
)

export default router
