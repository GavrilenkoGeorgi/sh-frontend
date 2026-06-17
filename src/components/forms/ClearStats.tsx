import { type FC, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useClearStatsMutation } from '../../store/api/gameApi'
import { setNotification } from '../../store/slices/notificationSlice'
import { ToastTypes } from '../../types'

import * as styles from './Form.module.sass'
import { useTranslation } from 'react-i18next'
import { Button } from '../layout/Button/BaseButton'
import { BaseModal } from '../layout/Modal/BaseModal'

const ClearStats: FC = () => {
  const dispatch = useDispatch()
  const [clearStats, { isLoading }] = useClearStatsMutation()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const deleteHandler = async (): Promise<void> => {
    try {
      await clearStats().unwrap()
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.statsCleared'),
          type: ToastTypes.SUCCESS
        })
      )
      setIsOpen(false)
    } catch {
      // error toast is handled centrally in baseQueryWithReauth
    }
  }

  return (
    <>
      <form className={styles.form}>
        <fieldset className={styles.buttons}>
          <Button
            // className={styles.deleteBtn}
            variant="danger"
            onPress={() => setIsOpen(true)}
          >
            {t('ui.buttonLabels.clearStats')}
          </Button>
        </fieldset>
      </form>
      {isOpen && (
        <BaseModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title={t('pages.clearStats.modal.heading')}
          footerActions={(close) => (
            <>
              <Button
                variant="danger"
                onPress={deleteHandler}
                isLoading={isLoading}
              >
                {t('ui.buttonLabels.delete')}
              </Button>
              <Button variant="secondary" onPress={close}>
                {t('ui.buttonLabels.cancel')}
              </Button>
            </>
          )}
        >
          <p>{t('pages.clearStats.modal.text')}</p>
        </BaseModal>
      )}
    </>
  )
}

export default ClearStats
