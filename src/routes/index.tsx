import React from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'

import App from '../App'
import LoginPage from '../pages/Login'
import ProfilePage from '../pages/Profile'
import GlobalStatsPage from '../pages/GlobalStats'
import GamePage from '../pages/Game'
import HelpPage from '../pages/Help'
import MainPage from '../pages/Main'
import ProtectedRoute from './ProtectedRoute'
import NavBar from '../components/navigation/NavBar'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<><NavBar /><App /></>}>
      <Route index={true} path='/' element={<MainPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/help' element={<HelpPage />} />
      <Route path='/game' element={<GamePage />} />
      <Route path='' element={<ProtectedRoute />} >
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/stats' element={<GlobalStatsPage />} />
      </Route>
    </Route>
  )
)

export default router
