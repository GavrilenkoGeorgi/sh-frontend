import { JSX } from 'react'
import { useSelector } from 'react-redux'
import NavBar from '../components/navigation/NavBar'
import App from '../App'
import Toast from '../components/layout/Toast'
import UpdateToast from '../components/layout/UpdateToast'
import Fallback from '../components/layout/Fallback'
import { selectAuthInitialized } from '../store/slices/authSlice'
import { useAuthBootstrap } from '../hooks/auth/useAuthBootstrap'
import { useMultiplayerSocket } from '../hooks/useMultiplayerSocket'
import { ColorSchemeProvider } from '../hooks/useColorScheme'

const RootLayout = (): JSX.Element => {
  useAuthBootstrap()
  useMultiplayerSocket()
  const authInitialized = useSelector(selectAuthInitialized)

  return (
    <ColorSchemeProvider>
      <NavBar />
      {authInitialized ? <App /> : <Fallback />}
      <Toast />
      <UpdateToast />
    </ColorSchemeProvider>
  )
}

export default RootLayout
