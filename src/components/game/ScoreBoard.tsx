import React, { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { type RootState } from '../../store'
import { saveScore } from '../../store/slices/shSlice'
import * as styles from './ScoreBoard.module.sass'
import { SaveScorePayload } from '../../types'

const ScoreBoard: FC = () => {
  const { game } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()

  const save = (id: SaveScorePayload): void => {
    if (game.rollCount > 0) {
      dispatch(saveScore(id))
    }
  }

  return (
    <div className={styles.results}>
      {Object.keys(game.combinations).map((key) => (
        <div className={styles.score} key={key}>
          <div
            className={styles.name}
            onClick={() => {
              save(key as SaveScorePayload)
            }}
          >
            {key}
          </div>
          {game.combinations[key].map((value, index) => (
            <div key={key + index} className={styles.result}>
              {value}
            </div>
          ))}
          {game.results[key as keyof typeof game.results] > 0 && (
            <div
              onClick={() => {
                save(key as SaveScorePayload)
              }}
              className={styles.preliminaryResult}
            >
              {game.results[key as keyof typeof game.results]}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ScoreBoard
