import React, { type FC, useEffect } from 'react'
import { useDispatch } from 'react-redux/es/exports'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCheckAuthMutation } from './store/slices/userApiSlice'
import { setCredentials } from './store/slices/authSlice'
import { setNotification } from './store/slices/notificationSlice'
import { ToastTypes } from './types'
import { getErrMsg } from './utils'

const App: FC = () => {

  const dispatch = useDispatch()
  const [checkAuth] = useCheckAuthMutation()
  const { pathname } = useLocation()

  const refreshAuth = async (): Promise<void> => {
    try {
      const res = await checkAuth({}).unwrap()
      dispatch(setCredentials({ ...res }))
      dispatch(setNotification({
        msg: 'Login ok',
        type: ToastTypes.SUCCESS
      }))
    } catch (err: unknown) {
      dispatch(setNotification({
        msg: getErrMsg(err),
        type: ToastTypes.ERROR
      }))
    }
  }

  useEffect(() => {
    // check if refresh is possible
    const auth = Boolean(localStorage.getItem('accessToken'))
    if (auth) { void refreshAuth() }
  }, [])

  return <motion.div
    key={pathname}
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      duration: 1,
      ease: [0.6, -0.05, 0.01, 0.99],
      type: 'Inertia',
      stiffness: 200
    }}
  >
    <Outlet />
  </motion.div>
}

export default App
