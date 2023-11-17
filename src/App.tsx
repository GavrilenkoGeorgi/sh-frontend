import React, { type FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useCheckAuthMutation } from './store/slices/userApiSlice'
import { setCredentials } from './store/slices/authSlice'
import { useDispatch } from 'react-redux/es/exports'

const App: FC = () => {

  const dispatch = useDispatch()
  const [checkAuth] = useCheckAuthMutation()

  const refreshAuth = async (): Promise<void> => {
    try {
      const res = await checkAuth({}).unwrap()
      dispatch(setCredentials({ ...res }))
    } catch (err) {
      console.log('Check auth error', err)
    }
  }

  useEffect(() => {
    // check if refresh is possible
    const auth = Boolean(localStorage.getItem('accessToken'))
    if (auth) { void refreshAuth() }
  }, [])

  return <Outlet />
}

export default App
