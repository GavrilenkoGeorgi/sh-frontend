import React, { type FC } from 'react'
import Dice from '../components/Dice'
import styles from './Game.module.sass'

import { rollDice } from '../store/slices/shSlice'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'

const GamePage: FC = () => {

  const dispatch = useDispatch()
  const { gameScore } = useSelector((state: RootState) => state.sh)

  // show school dice svgs in order
  const dice = [1, 2, 3, 4, 5, 6]

  const handleClick = (): void => {
    console.log('Click play')
    dispatch(rollDice({}))
  }

  const selectDice = (): void => {
    console.log('Selecting this dice')
  }

  return <section className={styles.game}>
    <h1>Score: 234</h1>
    {/* School results */}
    <div className={styles.school}>
      {dice.map(item =>
        <Dice key={item} kind={item} />
      )}
      {gameScore.school.map((result, index) =>
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
        {Object.keys(gameScore.game).map(key =>
          <div
            className={styles.combScore}
            key={key}
          >
            <div
              className={styles.combName}
            >
              {key}
            </div>
            {gameScore.game[key].map((value, index) =>
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
      {gameScore.roll.map((value, index) =>
        <Dice
          kind={value}
          key={value.toString() + index}
          onClick={selectDice}
        />
      )}
      <button onClick={handleClick}>
        play
      </button>
    </div>
  </section>
}

export default GamePage
