import { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { logout, selectCurrentUser } from '../../store/slices/authSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { apiSlice, gameSlice } from '../../store/slices/apiSlice'
import LoadingIndicator from '../layout/LoadingIndicator'
import { getErrMsg, toPath } from '../../utils'
import { ToastTypes } from '../../types'
import * as styles from './Form.module.sass'
import { useLogoutMutation } from '../../store/slices/userApiSlice'
import { ROUTES } from '../../constants/routes'
import { clearAuthSessionHint } from '../../utils/authSessionHint'

const Logout: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)

  const [logoutApiCall, { isLoading }] = useLogoutMutation()

  const logoutHandler = async (): Promise<void> => {
    try {
      await logoutApiCall().unwrap()
      clearAuthSessionHint()

      // Clear client state
      dispatch(logout())
      dispatch(apiSlice.util.resetApiState())
      dispatch(gameSlice.util.resetApiState())

      // Notify user
      dispatch(
        setNotification({
          msg: 'You have been logged out',
          type: ToastTypes.SUCCESS
        })
      )

      // Navigate after state is clean
      navigate(toPath(ROUTES.HOME), { viewTransition: true })
    } catch (err: unknown) {
      dispatch(
        setNotification({
          msg: getErrMsg(err),
          type: ToastTypes.ERROR
        })
      )
    }
  }

  return (
    <button
      type="button"
      onClick={logoutHandler}
      disabled={user == null || isLoading}
      className={styles.button}
      aria-busy={isLoading}
    >
      {isLoading ? <LoadingIndicator dark /> : 'logout'}
    </button>
  )
}

export default Logout
