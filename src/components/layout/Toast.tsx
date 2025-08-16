import React, { type FC, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { setNotification } from '../../store/slices/notificationSlice'
import { type RootState } from '../../store'
import { ToastTypes } from '../../types'

import CloseIcon from '../../assets/svg/icon-close.svg'
import * as styles from './Toast.module.sass'

const Toast: FC = () => {
  const dispatch = useDispatch()
  const { message, type, busy } = useSelector(
    (state: RootState) => state.notification
  )
  const [open, setOpen] = useState(false)
  const autoCloseTimer = useRef<number | null>(null)
  const AUTO_CLOSE_MS = 4000 // milliseconds before auto-close

  const close = (): void => {
    // clear pending auto-close timer
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current)
      autoCloseTimer.current = null
    }

    setOpen(false)
    setTimeout(() => {
      dispatch(setNotification({ msg: null }))
    }, 500) // close anim length
  }

  const handleMouseEnter = (): void => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current)
      autoCloseTimer.current = null
    }
  }

  const handleMouseLeave = (): void => {
    // restart auto-close only when not busy
    if (message != null && !busy) {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current)
      }
      autoCloseTimer.current = window.setTimeout(() => {
        close()
        autoCloseTimer.current = null
      }, AUTO_CLOSE_MS)
    }
  }

  useEffect(() => {
    if (message != null) {
      setOpen(true)

      // schedule auto-close only when not busy
      if (!busy) {
        if (autoCloseTimer.current) {
          clearTimeout(autoCloseTimer.current)
        }
        autoCloseTimer.current = window.setTimeout(() => {
          close()
          autoCloseTimer.current = null
        }, AUTO_CLOSE_MS)
      }
    } else {
      setOpen(false)
    }

    return () => {
      // cleanup timer on unmount or on message change
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current)
        autoCloseTimer.current = null
      }
    }
  }, [message, busy])

  return (
    <>
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
        <div
          className={styles.iconContainer}
          onClick={() => {
            close()
          }}
        >
          <CloseIcon />
        </div>
      </div>
    </>
  )
}

export default Toast
