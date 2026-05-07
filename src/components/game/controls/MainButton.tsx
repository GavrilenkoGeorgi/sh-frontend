import React, { type FC, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

import { rollDice } from '../../../store/slices/shSlice'
import { setNotification } from '../../../store/slices/notificationSlice'
import type { RootState } from '../../../store'
import * as styles from './DnDDiceBoard.module.sass'
import { ToastTypes } from '../../../types'

import SaveIcon from '../../../assets/svg/save-result.svg'
import RollActionButton from './RollActionButton'
import { useTranslation } from 'react-i18next'

const MainButton: FC = () => {
  const {
    game: { lock, rollCount }
  } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const lockedPressCount = useRef(0)

  useEffect(() => {
    if (!lock) lockedPressCount.current = 0
  }, [lock])

  const roll = (): void => {
    dispatch(rollDice())
  }

  const handleLockedPress = (): void => {
    if (!lock) {
      return
    }
    lockedPressCount.current += 1
    if (lockedPressCount.current >= 3) {
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.saveWarning'),
          type: ToastTypes.SUCCESS
        })
      )
      lockedPressCount.current = 0
    }
  }

  return (
    <RollActionButton
      rollCount={rollCount}
      isLocked={lock}
      onRoll={roll}
      onLockedPress={handleLockedPress}
      lockedIcon={<SaveIcon />}
      className={cx(styles.rollButton, {
        [styles.locked]: lock,
        [styles.rolled]: rollCount === 1,
        [styles.lastRoll]: rollCount === 2
      })}
    />
  )
}

export default MainButton
