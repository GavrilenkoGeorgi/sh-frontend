import React, { type FC, useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { setNotification } from '../../store/slices/notificationSlice'
import { type RootState } from '../../store'
import { ToastTypes } from '../../types'

import CloseIcon from '../../assets/svg/icon-close.svg'
import * as styles from './Toast.module.sass'

const AUTO_CLOSE_MS = 5000

const Toast: FC = () => {
  const dispatch = useDispatch()
  const { message, type, busy, autoClose } = useSelector(
    (state: RootState) => state.notification
  )

  const [open, setOpen] = useState(false)
  const autoCloseTimer = useRef<number | null>(null)

  const shouldAutoClose = message != null && autoClose && !busy

  const clearAutoCloseTimer = useCallback((): void => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current)
      autoCloseTimer.current = null
    }
  }, [])

  const close = useCallback((): void => {
    clearAutoCloseTimer()

    setOpen(false)

    window.setTimeout(() => {
      dispatch(setNotification({ msg: null }))
    }, 500)
  }, [dispatch, clearAutoCloseTimer])

  const startAutoCloseTimer = useCallback((): void => {
    if (!shouldAutoClose) return

    clearAutoCloseTimer()

    autoCloseTimer.current = window.setTimeout(() => {
      close()
      autoCloseTimer.current = null
    }, AUTO_CLOSE_MS)
  }, [shouldAutoClose, clearAutoCloseTimer, close])

  const handleMouseEnter = (): void => {
    clearAutoCloseTimer()
  }

  const handleMouseLeave = (): void => {
    startAutoCloseTimer()
  }

  useEffect(() => {
    if (message != null) {
      setOpen(true)
      startAutoCloseTimer()
    } else {
      setOpen(false)
      clearAutoCloseTimer()
    }

    return () => {
      clearAutoCloseTimer()
    }
  }, [message, startAutoCloseTimer, clearAutoCloseTimer])

  return (
    <div
      id={styles.toast}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cx(styles.toast, {
        [styles.show]: message,
        [styles.hide]: !open,
        [styles.error]: type === ToastTypes.ERROR,
        [styles.success]: type === ToastTypes.SUCCESS
      })}
    >
      <div>{message}</div>
      <div className={styles.iconContainer} onClick={close}>
        <CloseIcon />
      </div>
    </div>
  )
}

export default Toast
