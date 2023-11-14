import React, { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

import { type RootState } from '../../store'
import { saveScore, endGame } from '../../store/slices/shSlice'
import { type CanSaveProps } from '../../types'
import TrainingBoardIcons from './TrainingBoardIcons'
import styles from './TrainingBoard.module.sass'

const TrainingBoard: FC = () => {

  const { game } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()

  const save = (id: string): void => {
    if (game.rollCount > 0) {
      dispatch(saveScore(id))
    }
  }

  const canSave = ({ final, score }: CanSaveProps): boolean => {
    if (!final && score != null) return true
    else return false
  }

  const checkEndGame = (): void => {
    dispatch(endGame())
  }

  return <div className={styles.training}>
    <TrainingBoardIcons />
    {Object.keys(game.school).map((key) =>
      <div
        id={key}
        key={key}
        className={cx(styles.result, {
          [styles.pre]: !game.school[key].final
        })}
        onClick={canSave(game.school[key])
          ? () => { save(key) }
          : () => { checkEndGame() }
        }
      >
        {game.school[key].score}
      </div>
    )}
  </div>
}

export default TrainingBoard
