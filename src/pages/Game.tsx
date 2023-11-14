import React, { type FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// state
import type { RootState } from '../store'
import { type CanSaveProps } from '../types'
import { useSaveResultsMutation } from '../store/slices/gameApiSlice'
import {
  setScore,
  saveScore,
  endGame,
  reset
} from '../store/slices/shSlice'

// components and styles
import ProgressBar from '../components/layout/ProgressBar'
import SchoolDice from '../components/game/SchoolDice'
import Modal from '../components/layout/Modal'
import DnDDiceBoard from '../components/game/controls/DnDDiceBoard'
import cx from 'classnames'
import styles from './Game.module.sass'

const GamePage: FC = () => {

  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [saveResults] = useSaveResultsMutation()

  const save = (id: string): void => {
    if (game.rollCount > 0) {
      dispatch(saveScore(id))
    }
  }

  const checkEndGame = (): void => {
    dispatch(endGame())
  }

  const complete = async (): Promise<void> => {
    try {
      const data = {
        score: game.score,
        schoolScore: game.schoolScore,
        stats: game.stats,
        favDiceValues: game.favDiceValues
      }

      if (userInfo === null) console.log('CTA to register')
      else await saveResults(data)

      dispatch(reset())

    } catch (err) {
      console.log(err) // TODO: proper err handling
    } finally {
      console.log('Saved.') // TODO: toasts
    }
  }

  // on selection change calc score
  useEffect(() => {
    if (game.selection.length > 0) {
      dispatch(setScore(game.selection))
    }
  }, [game.selection])

  const canSave = ({ final, score }: CanSaveProps): boolean => {
    if (!final && score != null) return true
    else return false
  }

  return <section className={styles.game}>
    <h1>Score: {game.score}</h1>
    {/* Training results */}
    <div className={styles.school}>
      <SchoolDice />
      {Object.keys(game.school).map((key) =>
        <div
          id={key}
          key={key}
          className={cx(styles.schoolResult, {
            [styles.pre]: !game.school[key].final
          })}
          onClick={canSave(game.school[key]) ? () => { save(key) } : () => { checkEndGame() } }
        >
          {game.school[key].score}
        </div>
      )}
    </div>
    {/* Game results */}
    <div className={styles.gameResult}>
      {/* actual results from store will go here */}
      <div className={styles.results}>
        {Object.keys(game.combinations).map(key =>
          <div
            className={styles.combScore}
            key={key}
          >
            <div
              className={styles.combName}
              onClick={() => { save(key) }}
            >
              {key}
            </div>
          {game.combinations[key].map((value, index) =>
            <div
              key={key + index}
              className={styles.combResult}
            >
              {value}
            </div>
          )}
          {game.results[key as keyof typeof game.results] > 0 &&
            <div
              onClick={() => { save(key) }}
              className={styles.preliminaryResult}
            >
              {game.results[key as keyof typeof game.results]}
            </div>
          }
          </div>
        )}
      </div>
    </div>
    <ProgressBar count={game.rollCount} />
    {/* Game controls */}
    <DnDDiceBoard />
    {game.end &&
      <Modal
        heading='Game end'
        text='Better luck next time'
        btnLabel='ok'
        onClick={() => dispatch(reset())}
      />
    }
    {game.turn === 34 &&
      <Modal
        heading='Result:'
        text='Finish'
        btnLabel='save result'
        onClick={() => { void complete() }}
      />
    }
  </section>
}

export default GamePage
