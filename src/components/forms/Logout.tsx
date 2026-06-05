import { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { logout, selectCurrentUser } from '../../store/slices/authSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { userApi, gameApi } from '../../store/api/baseApi'
import LoadingIndicator from '../layout/LoadingIndicator'
import { toPath } from '../../utils'
import { ToastTypes } from '../../types'
import * as styles from './Form.module.sass'
import { useLogoutMutation } from '../../store/api/userApi'
import { ROUTES } from '../../constants/routes'
import { clearAuthSessionHint } from '../../utils/authSessionHint'
import { useTranslation } from 'react-i18next'

const Logout: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const { t } = useTranslation()

  const [logoutApiCall, { isLoading }] = useLogoutMutation()

  const logoutHandler = async (): Promise<void> => {
    try {
      await logoutApiCall().unwrap()
      clearAuthSessionHint()

      // Clear client state
      dispatch(logout())
      dispatch(userApi.util.resetApiState())
      dispatch(gameApi.util.resetApiState())

      // Notify user
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.logoutSuccess'),
          type: ToastTypes.SUCCESS
        })
      )

      // Navigate after state is clean
      navigate(toPath(ROUTES.HOME), { viewTransition: true })
    } catch {
      // error toast is handled centrally in baseQueryWithReauth
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
      {isLoading ? <LoadingIndicator dark /> : t('ui.buttonLabels.logout')}
    </button>
  )
}

export default Logout
