import { Suspense, lazy } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router'

import { ROUTES } from '../constants/routes'
import LoginPage from '../pages/Login'
import MainPage from '../pages/Main'
import ProfilePage from '../pages/Profile'
import HelpPage from '../pages/Help'
import RegisterPage from '../pages/Register'
import PasswordPage from '../pages/Password'
import PrivacyPage from '../pages/Privacy'
import DeleteAccountPage from '../pages/DeleteAccount'
import ClearStatsPage from '../pages/ClearStats'
import SettingsPage from '../pages/Settings'
import Multiplayer from '../pages/Multiplayer'
import ProtectedRoute from './ProtectedRoute'
import RootLayout from './RootLayout'
import Fallback from '../components/layout/Fallback'

// heaviest routes
const StatsPage = lazy(async () => await import('../pages/Stats'))
const GamePage = lazy(async () => await import('../pages/Game'))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={ROUTES.HOME} element={<RootLayout />}>
      <Route index element={<MainPage />} />

      <Route
        path={ROUTES.PLAY}
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
      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path={ROUTES.STATS}
          element={
            <Suspense fallback={<Fallback />}>
              <StatsPage />
            </Suspense>
          }
        />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.MULTIPLAYER} element={<Multiplayer />} />
      </Route>
    </Route>
  )
)

export default router
