import { type FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'

import { useDeleteAccMutation } from '../../store/api/userApi'
import { setNotification } from '../../store/slices/notificationSlice'
import { logout } from '../../store/slices/authSlice'
import { userApi, gameApi } from '../../store/api/baseApi'
import { toPath } from '../../utils'
import { ToastTypes } from '../../types'

import * as styles from './Form.module.sass'
import { ROUTES } from '../../constants/routes'
import { clearAuthSessionHint } from '../../utils/authSessionHint'
import { useTranslation } from 'react-i18next'
import { Button } from '../layout/Button/BaseButton'
import { BaseModal } from '../layout/Modal/BaseModal'

const DeleteAccount: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [deleteAcc, { isLoading }] = useDeleteAccMutation()
  const [isOpen, setIsOpen] = useState(false)
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
      setIsOpen(false)
      navigate(toPath(ROUTES.HOME), { viewTransition: true })
    } catch {
      // error toast is handled centrally in baseQueryWithReauth
    }
  }

  return (
    <>
      <form className={styles.form}>
        <fieldset disabled={isLoading}>
          <div className={styles.buttons}>
            <Button variant="danger" size="sm" onPress={() => setIsOpen(true)}>
              {t('pages.deleteAccount.modal.mainButton')}
            </Button>
          </div>
        </fieldset>
      </form>
      {isOpen && (
        <BaseModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title={t('pages.deleteAccount.modal.title')}
          footerActions={(close) => (
            <>
              <Button
                size="sm"
                onPress={deleteHandler}
                variant="danger"
                isDisabled={isLoading}
              >
                {t('pages.deleteAccount.modal.confirmButton')}
              </Button>
              <Button size="sm" onPress={close}>
                {t('pages.deleteAccount.modal.cancelButton')}
              </Button>
            </>
          )}
        >
          <p>{t('pages.deleteAccount.modal.message')}</p>
        </BaseModal>
      )}
    </>
  )
}

export default DeleteAccount
