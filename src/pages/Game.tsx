import React, { type FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { useSaveResultsMutation } from '../store/slices/gameApiSlice'
import {
  rollDice,
  selectDice,
  deselectDice,
  setScore,
  saveScore,
  endGame,
  reset
} from '../store/slices/shSlice'
import SchoolDice from '../components/game/SchoolDice'
import Dice from '../components/game/Dice'
import cx from 'classnames'
import styles from './Game.module.sass'
import { type CanSaveProps } from '../types'
import ProgressBar from '../components/layout/ProgressBar'

const GamePage: FC = () => {

  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [saveResults] = useSaveResultsMutation()

  const roll = (): void => {
    dispatch(rollDice())
  }

  const select = (index: number): void => {
    if (game.rollCount > 0) {
      dispatch(selectDice(game.roll[index]))
    }
  }

  const deselect = (index: number): void => {
    dispatch(deselectDice(game.selection[index]))
  }

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
    if (!final && score !== null) return true
    else return false
  }

  return <section className={styles.game}>
    <h1>Score: {game.score}</h1>
    {/* School results */}
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
    {/* Game controls */}
    {game.turn <= 33 && <div className={styles.controls}>
      {game.selection.map((value, index) =>
        <div key={index}
          onClick={() => { deselect(index) }}
          className={styles.selectedDice}
        >
          <Dice kind={value} />
        </div>
      )}
      {game.roll.map((value, index) =>
        <div key={index}
          onClick={() => { select(index) }}
          className={styles.rolledDice}
        >
          <Dice kind={value} />
        </div>
      )}
      <button
        onClick={roll}
        disabled={game.lock}
        className={cx(styles.rollBtn, {
          [styles.locked]: game.lock
        })}
      >
        {game.lock
          ? 'save'
          : <>
              {game.rollCount === 0
                ? 'play'
                : Math.abs(game.rollCount - 3)
              }
            </>
        }
      </button>
    </div> }
    {game.end &&
      <div className={styles.modal}>
        <div className={styles.blur}></div>
        <div className={styles.message}>
          <h2>Game end</h2>
          <p>Better luck next time</p>
          <button onClick={() => dispatch(reset())}>
            ok
          </button>
        </div>
      </div>
    }
    {game.turn === 34 &&
      <div className={styles.modal}>
        <div className={styles.blur}></div>
        <div className={styles.message}>
          <h2>Result: {game.score}</h2>
          <button onClick={ () => { void complete() }}>
            Save result
          </button>
        </div>
      </div>
    }
    <ProgressBar count={game.rollCount} />
  </section>
}

export default GamePage
