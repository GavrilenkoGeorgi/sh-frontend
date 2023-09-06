import React from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import LoginPage from '../pages/Login'
import LogoutPage from '../components/Logout'
import MainPage from '../pages/Main'
import App from '../App'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<MainPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/logout' element={<LogoutPage />} />
    </Route>
  )
)

export default router

