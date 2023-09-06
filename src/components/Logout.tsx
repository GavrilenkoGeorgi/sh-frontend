import React, { type FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { type RootState } from '../store'
import { useLogoutMutation } from '../store/slices/userApiSlice'
import { logout } from '../store/slices/authSlice'

import styles from './Logout.module.sass'

const Logout: FC = () => {

  // eslint-disable-next-line
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async (): Promise<void> => {
    try {
      await logoutApiCall({}).unwrap()
      dispatch(logout({}))
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return <div className={styles.container}>
    <h1>
      Logout
    </h1>
    <button onClick={() => { void logoutHandler }}>
      Logout
    </button>
  </div>

}

export default Logout
