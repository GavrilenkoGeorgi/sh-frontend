import { type FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'

import { useDeleteAccMutation } from '../../store/api/userApi'
import { setNotification } from '../../store/slices/notificationSlice'
import { logout } from '../../store/slices/authSlice'
import { userApi, gameApi } from '../../store/api/baseApi'
import { toPath } from '../../utils'
import { ToastTypes } from '../../types'

import Modal from '../layout/Modal'
import * as styles from './Form.module.sass'
import { ROUTES } from '../../constants/routes'
import { clearAuthSessionHint } from '../../utils/authSessionHint'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-aria-components'

const DeleteAccount: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [deleteAcc, { isLoading }] = useDeleteAccMutation()
  const [openModal, setOpenModal] = useState(false)
  const { t } = useTranslation()

  const deleteHandler = async (): Promise<void> => {
    try {
      await deleteAcc().unwrap()
      clearAuthSessionHint()
      dispatch(logout())
      dispatch(userApi.util.resetApiState())
      dispatch(gameApi.util.resetApiState())
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.accountDeleted'),
          type: ToastTypes.SUCCESS
        })
      )
      navigate(toPath(ROUTES.HOME), { viewTransition: true })
    } catch {
      // error toast is handled centrally in baseQueryWithReauth
    }
  }

  return (
    <>
      <form className={styles.form}>
        <fieldset>
          <div className={styles.buttons}>
            <Button
              type="button"
              className={styles.deleteBtn}
              onClick={() => setOpenModal(true)}
            >
              {t('pages.deleteAccount.modal.mainButton')}
            </Button>
          </div>
        </fieldset>
      </form>
      {openModal && (
        <Modal /* TODO: separate component for deletion, we can pass children to it */
          heading={t('pages.deleteAccount.modal.title')}
          text={t('pages.deleteAccount.modal.message')}
          btnLabel={t('pages.deleteAccount.modal.confirmButton')}
          isBusy={isLoading}
          onClick={deleteHandler}
          close={() => setOpenModal(false)}
        />
      )}
    </>
  )
}

export default DeleteAccount
