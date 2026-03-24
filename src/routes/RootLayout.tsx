import React from 'react'
import { useSelector } from 'react-redux'
import NavBar from '../components/navigation/NavBar'
import App from '../App'
import Toast from '../components/layout/Toast'
import UpdatePrompt from '../components/layout/UpdatePrompt'
import Fallback from '../components/layout/Fallback'
import { selectAuthInitialized } from '../store/slices/authSlice'
import { useAuthBootstrap } from '../hooks/auth/useAuthBootstrap'

const RootLayout = (): React.JSX.Element => {
  useAuthBootstrap()
  const authInitialized = useSelector(selectAuthInitialized)

  return (
    <>
      <NavBar />
      {authInitialized ? <App /> : <Fallback />}
      <Toast />
      <UpdatePrompt />
    </>
  )
}

export default RootLayout
