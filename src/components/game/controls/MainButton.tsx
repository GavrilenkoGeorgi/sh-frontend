import React, { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

import { rollDice } from '../../../store/slices/shSlice'
import { setNotification } from '../../../store/slices/notificationSlice'
import type { RootState } from '../../../store'
import styles from './DnDDiceBoard.module.sass'
import { ToastTypes } from '../../../types'

import SaveIcon from '../../../assets/svg/save-result.svg'
import { PlayButtonIcon } from './PlayButtonIcon'

const MainButton: FC = () => {
  const {
    game: { lock, rollCount }
  } = useSelector((state: RootState) => state.sh)

  const dispatch = useDispatch()

  const roll = (): void => {
    dispatch(rollDice())
  }

  const handleButtonClick = (e: React.MouseEvent): void => {
    if (lock) {
      e.preventDefault()
      dispatch(
        setNotification({
          msg: 'Please choose one of the results before rolling again',
          type: ToastTypes.SUCCESS
        })
      )
    } else {
      roll()
    }
  }

  return (
    <button
      onClick={handleButtonClick}
      className={cx(styles.rollBtn, {
        [styles.locked]: lock,
        [styles.rolled]: rollCount === 1,
        [styles.lastRoll]: rollCount === 2
      })}
    >
      {lock ? <SaveIcon /> : <PlayButtonIcon rollCount={rollCount} />}
    </button>
  )
}

export default MainButton
