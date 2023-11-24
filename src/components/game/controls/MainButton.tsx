import React, { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

import { rollDice } from '../../../store/slices/shSlice'
import type { RootState } from '../../../store'
import styles from './DnDDiceBoard.module.sass'

const MainButton: FC = () => {

  const { game } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()

  const roll = (): void => {
    dispatch(rollDice())
  }

  return <button
    onClick={roll}
    disabled={game.lock}
    className={cx(styles.rollBtn, {
      [styles.locked]: game.lock,
      [styles.rolled]: game.rollCount === 1,
      [styles.lastRoll]: game.rollCount === 2
    })}
  >
    {game.lock // btn label
      ? 'save'
      : <>
          {game.rollCount === 0
            ? 'play'
            : Math.abs(game.rollCount - 3)
          }
        </>
    }
  </button>
}

export default MainButton
