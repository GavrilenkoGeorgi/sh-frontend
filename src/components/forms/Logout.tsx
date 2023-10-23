import React, { type FC } from 'react'
import { useDispatch } from 'react-redux'

import { useLogoutMutation } from '../../store/slices/userApiSlice'
import { logout } from '../../store/slices/authSlice'

const Logout: FC = () => {

  const dispatch = useDispatch()
  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async (): Promise<void> => {
    try {
      await logoutApiCall({}).unwrap()
      dispatch(logout())
    } catch (err) {
      console.error(err) // ui notification from store should handle this
    } finally {
      console.log('Logout ok.')
    }
  }

  return <button type='button' onClick={() => { void logoutHandler() }}>
    Logout
  </button>

}

export default Logout
