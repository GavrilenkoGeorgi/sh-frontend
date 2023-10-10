import React, { type FC } from 'react'
import Dice from '../components/game/Dice'
import SchoolDice from '../components/game/SchoolDice'
import styles from './Game.module.sass'

import { rollDice, selectDice, deselectDice, setScore } from '../store/slices/shSlice'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'

const GamePage: FC = () => {

  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)

  const roll = (): void => {
    dispatch(rollDice())
  }

  const select = (index: number): void => {
    dispatch(selectDice(game.roll[index]))
    dispatch(setScore({}))
  }

  const deselect = (index: number): void => {
    dispatch(deselectDice(game.selection[index]))
    dispatch(setScore({}))
  }

  return <section className={styles.game}>
    <h1>Score: {game.score}</h1>
    {/* School results */}
    <div className={styles.school}>
      <SchoolDice />
      {game.school.map((result, index) =>
        <div
          className={styles.schoolResult}
          key={index.toString() + result}
        >
          {result}
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
          </div>
        )}
      </div>
    </div>
    {/* Game controls */}
    <div className={styles.controls}>
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
      >
        {game.lock ? 'save' : 'play'}
      </button>
    </div>
  </section>
}

export default GamePage
