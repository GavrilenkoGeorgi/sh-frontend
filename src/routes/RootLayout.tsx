import React from 'react'
import { useSelector } from 'react-redux'
import NavBar from '../components/navigation/NavBar'
import App from '../App'
import Toast from '../components/layout/Toast'
import UpdatePrompt from '../components/layout/UpdatePrompt'
import { selectAuthInitialized } from '../store/slices/authSlice'
import { useAuthBootstrap } from '../hooks/auth/useAuthBootstrap'
import * as styles from '../pages/SharedStyles.module.sass'

const LoadingOverlay = () => (
  <div
    className={styles.motionDiv}
    style={{ display: 'flex', justifyContent: 'center', padding: 20 }}
  >
    <div>Checking session...</div>
  </div>
)

const RootLayout = (): React.JSX.Element => {
  useAuthBootstrap()
  const authInitialized = useSelector(selectAuthInitialized)

  return (
    <>
      <NavBar />
      {authInitialized ? <App /> : <LoadingOverlay />}
      <Toast />
      <UpdatePrompt />
    </>
  )
}

export default RootLayout
