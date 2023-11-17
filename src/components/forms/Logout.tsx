import React, { type FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useLogoutMutation } from '../../store/slices/userApiSlice'
import { logout } from '../../store/slices/authSlice'
import { type RootState } from '../../store'
import LoadingIndicator from '../layout/LoadingIndicator'

const Logout: FC = () => {

  const dispatch = useDispatch()
  const [logoutApiCall] = useLogoutMutation()
  const [loading, setLoading] = useState(false)
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const logoutHandler = async (): Promise<void> => {
    try {
      setLoading(true)
      await logoutApiCall({}).unwrap()
      dispatch(logout())
    } catch (err) {
      console.error(err) // ui notification from store should handle this
    } finally {
      setLoading(false)
    }
  }

  return <button
    type='button'
    onClick={() => { void logoutHandler() }}
    disabled={userInfo == null}
  >
    {loading
      ? <LoadingIndicator dark />
      : 'logout'
    }
  </button>

}

export default Logout
