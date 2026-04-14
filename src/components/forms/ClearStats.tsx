import React, { type FC, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useClearStatsMutation } from '../../store/slices/gameApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { getErrMsg } from '../../utils'
import { ToastTypes } from '../../types'

import Modal from '../layout/Modal'
import * as styles from './Form.module.sass'
import { useTranslation } from 'react-i18next'

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
    <>
      <form className={styles.form}>
        <fieldset className={styles.buttons}>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => {
              setOpenModal(true)
            }}
          >
            {t('ui.buttonLabels.clearStats')}
          </button>
        </fieldset>
      </form>
      {openModal && (
        <Modal
          heading="Are you sure?"
          text="You are about to delete all your game results and clear stats!"
          btnLabel={t('ui.buttonLabels.delete')}
          isBusy={isLoading}
          onClick={() => deleteHandler()}
          close={() => {
            setOpenModal(false)
          }}
        />
      )}
    </>
  )
}

export default ClearStats
