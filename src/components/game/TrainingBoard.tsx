import React, { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

import { type RootState } from '../../store'
import { saveScore, gameOver } from '../../store/slices/shSlice'
import { type CanSaveProps } from '../../types'
import { Dice } from './Dice'
import * as styles from './TrainingBoard.module.sass'

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

  const checkGameOver = (): void => {
    dispatch(gameOver())
  }

  return (
    <div className={styles.training}>
      {Object.keys(game.school).map((key, index) => (
        <div
          id={key}
          key={key}
          className={cx(styles.result, {
            [styles.savable]:
              game.school[key].score != null && !game.school[key].final
          })}
          onClick={
            canSave(game.school[key])
              ? () => {
                  save(key)
                }
              : () => {
                  checkGameOver()
                }
          }
        >
          <div>
            <Dice kind={index + 1} />
            {game.school[key].score}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TrainingBoard
