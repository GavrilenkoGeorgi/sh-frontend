import React, { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { setNotification } from '../../store/slices/notificationSlice'
import { type RootState } from '../../store'
import { ToastTypes } from '../../types'

import CloseIcon from '../../assets/svg/icon-close.svg'
import styles from './Toast.module.sass'

const Toast: FC = () => {

  const dispatch = useDispatch()
  const { message, type } = useSelector((state: RootState) => state.notification)

  const close = (): void => {
    dispatch(setNotification({ msg: null }))
  }

  return <>
    <div
      id={styles.toast}
      className={cx(styles.toast, {
        [styles.show]: message,
        [styles.error]: type === ToastTypes.ERROR,
        [styles.success]: type === ToastTypes.SUCCESS
      })}
    >
      <div>
        {message}
      </div>
      <div
        className={styles.iconContainer}
        onClick={ () => { close() } }
      >
        <CloseIcon />
      </div>
    </div>
  </>
}

export default Toast
