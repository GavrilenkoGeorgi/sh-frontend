import React, { type FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useDeleteAccMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { logout } from '../../store/slices/authSlice'
import { getErrMsg } from '../../utils'
import { ToastTypes } from '../../types'

import Modal from '../layout/Modal'
import styles from './Form.module.sass'

const DeleteAccount: FC = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [deleteAcc] = useDeleteAccMutation()
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const deleteHandler = async (): Promise<void> => {
    try {
      setLoading(true)
      await deleteAcc({}).unwrap()
      dispatch(logout())
      dispatch(setNotification({
        msg: 'Account deleted',
        type: ToastTypes.SUCCESS
      }))
      navigate('/')
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
      <fieldset>
      <div className={styles.buttons}>
        <button
          type='button'
          className={styles.deleteBtn}
          onClick={ () => { setOpenModal(true) } }
        >
          Delete account
        </button>
      </div>
      </fieldset>
    </form>
    {openModal &&
      <Modal
        heading='Are you sure?'
        text='You are about to delete your account and all game results!'
        btnLabel='delete'
        isBusy={loading}
        onClick={() => { void deleteHandler() }}
        close={() => { setOpenModal(false) }}
      />
    }
  </>
}

export default DeleteAccount
