import React, { type FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { useLogoutMutation } from '../../store/slices/userApiSlice'
import { logout } from '../../store/slices/authSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { type RootState } from '../../store'
import LoadingIndicator from '../layout/LoadingIndicator'
import { getErrMsg } from '../../utils'
import { ToastTypes } from '../../types'
import * as styles from './Form.module.sass'

const Logout: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logoutApiCall] = useLogoutMutation()
  const [loading, setLoading] = useState(false)
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const logoutHandler = async (): Promise<void> => {
    try {
      setLoading(true)
      await logoutApiCall({}).unwrap()
      dispatch(logout())
      navigate('/')
    } catch (err: unknown) {
      dispatch(
        setNotification({
          msg: getErrMsg(err),
          type: ToastTypes.ERROR
        })
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void logoutHandler()
      }}
      disabled={userInfo == null}
      className={styles.button}
    >
      {loading ? <LoadingIndicator dark /> : 'logout'}
    </button>
  )
}

export default Logout
