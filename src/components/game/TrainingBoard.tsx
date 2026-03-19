import React, { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

import { type RootState } from '../../store'
import { saveScore, gameOver } from '../../store/slices/shSlice'
import {
  SaveScorePayload,
  type CanSaveProps,
  SchoolCombinations
} from '../../types'
import { Dice } from './Dice'
import * as styles from './TrainingBoard.module.sass'

const TrainingBoard: FC = () => {
  const { game } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()

  const save = (id: SaveScorePayload): void => {
    if (game.rollCount > 0) {
      dispatch(saveScore(id))
    }
  }

  const canSave = ({ final, score }: CanSaveProps): boolean => {
    return !final && score != null
  }

  const checkGameOver = (): void => {
    dispatch(gameOver())
  }

  return (
    <div className={styles.training}>
      {Object.values(SchoolCombinations).map((key, index) => {
        const score = game.school[key].score
        const hasScore = score !== null && score !== undefined

        return (
          <div
            id={key}
            key={key}
            className={cx(styles.qualiResult, {
              [styles.savable]: hasScore && !game.school[key].final
            })}
            onClick={
              canSave(game.school[key])
                ? () => save(key)
                : () => checkGameOver()
            }
          >
            <div>
              <p
                className={cx(styles.qualiScore, {
                  [styles.visible]: hasScore,
                  [styles.hidden]: !hasScore
                })}
              >
                {hasScore ? score : '\u00A0'}
              </p>
              <Dice kind={index + 1} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TrainingBoard
