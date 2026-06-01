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

const DeleteAccount: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [deleteAcc] = useDeleteAccMutation()
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const { t } = useTranslation()

  const deleteHandler = async (): Promise<void> => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form className={styles.form}>
        <fieldset>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => {
                setOpenModal(true)
              }}
            >
              Delete account
            </button>
          </div>
        </fieldset>
      </form>
      {openModal && (
        <Modal
          heading="Are you sure?"
          text="You are about to delete your account and all game results!"
          btnLabel={t('ui.buttonLabels.delete')}
          isBusy={loading}
          onClick={() => {
            void deleteHandler()
          }}
          close={() => {
            setOpenModal(false)
          }}
        />
      )}
    </>
  )
}

export default DeleteAccount
