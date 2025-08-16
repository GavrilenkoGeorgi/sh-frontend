import { type LoaderFunctionArgs } from 'react-router'
import store from '../store'
import {
  setCredentials,
  startCheckingAuth,
  finishCheckingAuth
} from '../store/slices/authSlice'
import { setNotification } from '../store/slices/notificationSlice'
import { userApiSlice } from '../store/slices/userApiSlice'
import { ToastTypes } from '../types'

const CHECK_TIMEOUT = 5000 // ms

export async function authLoader(_: LoaderFunctionArgs) {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) return null

  // start checking flag
  store.dispatch(startCheckingAuth())

  // use RTK Query initiate to reuse logic and caching
  const promise = store.dispatch(
    userApiSlice.endpoints.checkAuth.initiate(undefined)
  )

  // add timeout to avoid hanging
  const timeout = new Promise((resolve) => setTimeout(resolve, CHECK_TIMEOUT))

  try {
    const res: any = await Promise.race([promise, timeout])
    if (res && 'data' in res && res.data && res.data.user) {
      store.dispatch(
        setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken
        })
      )
    }
  } catch (err: unknown) {
    store.dispatch(
      setNotification({
        msg: 'Failed to refresh session',
        type: ToastTypes.ERROR
      })
    )
  } finally {
    store.dispatch(finishCheckingAuth())
  }

  return null
}
