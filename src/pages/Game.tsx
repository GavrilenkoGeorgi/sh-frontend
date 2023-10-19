import React, { type FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { useSaveResultsMutation } from '../store/slices/gameApiSlice'
import {
  rollDice,
  selectDice,
  deselectDice,
  setScore,
  saveScore
} from '../store/slices/shSlice'
import SchoolDice from '../components/game/SchoolDice'
import Dice from '../components/game/Dice'
import cx from 'classnames'
import styles from './Game.module.sass'

const GamePage: FC = () => {

  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)
  const [saveResults] = useSaveResultsMutation()

  const roll = (): void => {
    dispatch(rollDice())
  }

  const select = (index: number): void => {
    dispatch(selectDice(game.roll[index]))
  }

  const deselect = (index: number): void => {
    dispatch(deselectDice(game.selection[index]))
  }

  const save = (id: string): void => {
    dispatch(saveScore(id))
  }

  const end = async (): Promise<void> => {
    try {
      const data = {
        score: game.score,
        stats: game.stats,
        favDiceValues: game.favDiceValues
      }
      await saveResults(data)
    } catch (err) {
      console.log(err) // TODO: propeer err handling
    }
  }

  // on selection change calc score
  useEffect(() => {
    dispatch(setScore(game.selection))
  }, [game.selection])

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
          onClick={() => { save(key) }}
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
    { game.turn <= 33 && <div className={styles.controls}>
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
        {game.lock ? 'save' : 'play'}
      </button>
    </div> }
    { game.turn === 34 &&
      <div className={styles.saveResults}>
        <button onClick={ () => { void end() }}>
          Save results
        </button>
      </div>
    }
  </section>
}

export default GamePage
