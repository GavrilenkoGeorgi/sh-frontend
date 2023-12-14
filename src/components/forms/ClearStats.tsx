import React, { type FC, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useClearStatsMutation } from '../../store/slices/gameApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { getErrMsg } from '../../utils'
import { ToastTypes } from '../../types'

import Modal from '../layout/Modal'
import styles from './Form.module.sass'

const ClearStats: FC = () => {

  const dispatch = useDispatch()
  const [clearStats] = useClearStatsMutation()
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const deleteHandler = async (): Promise<void> => {
    try {
      setLoading(true)
      await clearStats({}).unwrap()
      dispatch(setNotification({
        msg: 'Stats cleared',
        type: ToastTypes.SUCCESS
      }))
      setOpenModal(false)
    } catch (err: unknown) {
      dispatch(setNotification({
        msg: getErrMsg(err),
        type: ToastTypes.ERROR
      }))
    } finally {
      setLoading(false)
    }
  }

  return <>
    <form className={styles.form}>
      <fieldset className={styles.buttons}>
        <button
          type='button'
          className={styles.deleteBtn}
          onClick={ () => { setOpenModal(true) } }
        >
          Clear stats
        </button>
      </fieldset >
    </form>
    {openModal &&
      <Modal
        heading='Are you sure?'
        text='You are about to delete all your game results and clear stats!'
        btnLabel='delete'
        isBusy={loading}
        onClick={() => { void deleteHandler() }}
        close={() => { setOpenModal(false) }}
      />
    }
  </>
}

export default ClearStats
