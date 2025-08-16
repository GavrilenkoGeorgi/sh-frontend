import React from 'react'
import { useSelector } from 'react-redux'
import NavBar from '../components/navigation/NavBar'
import App from '../App'
import Toast from '../components/layout/Toast'
import { type RootState } from '../store'
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
  const { isCheckingAuth } = useSelector((state: RootState) => state.auth)

  return (
    <>
      <NavBar />
      {isCheckingAuth ? <LoadingOverlay /> : <App />}
      <Toast />
    </>
  )
}

export default RootLayout
