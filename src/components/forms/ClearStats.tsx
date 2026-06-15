import React, { type FC, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useClearStatsMutation } from '../../store/api/gameApi'
import { setNotification } from '../../store/slices/notificationSlice'
import { ToastTypes } from '../../types'

import Modal from '../layout/Modal'
import * as styles from './Form.module.sass'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-aria-components'

const ClearStats: FC = () => {
  const dispatch = useDispatch()
  const [clearStats, { isLoading }] = useClearStatsMutation()
  const [openModal, setOpenModal] = useState(false)
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
      setOpenModal(false)
    } catch {
      // error toast is handled centrally in baseQueryWithReauth
    }
  }

  return (
    <>
      <form className={styles.form}>
        <fieldset className={styles.buttons}>
          <Button
            type="button"
            className={styles.deleteBtn}
            onClick={() => setOpenModal(true)}
          >
            {t('ui.buttonLabels.clearStats')}
          </Button>
        </fieldset>
      </form>
      {openModal && (
        <Modal
          heading={t('pages.clearStats.modal.heading')}
          text={t('pages.clearStats.modal.text')}
          btnLabel={t('ui.buttonLabels.delete')}
          isBusy={isLoading}
          onClick={deleteHandler}
          close={() => setOpenModal(false)}
        />
      )}
    </>
  )
}

export default ClearStats
