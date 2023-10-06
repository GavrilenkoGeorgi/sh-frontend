import React, { type FC } from 'react'
import ShScore from '../utils/sh-score'
import { Combinations } from '../types'
import Dice from '../components/Dice'
import styles from './Game.module.sass'

const GamePage: FC = () => {

  // preliminary mock data
  const dice = [1, 2, 3, 4, 5, 6]
  const combResult = new Array(3).fill(0)
  const schoolResults = new Array(6).fill(0)

  const names = Object.values(Combinations)
  const gameResults: Record<string, number[]> = {}

  names.forEach(name => {
    gameResults[name] = combResult
  })

  // controls
  const currentState = [1, 4, 6, 3, 2]

  const handleClick = (): void => {
    const roll = ShScore.rollDice()
    const score = ShScore.getScore(roll)
    console.log('Roll: ', roll)
    console.log('Score: ', score)
  }

  return <section className={styles.game}>
    <h1>Score: 234</h1>
    {/* School results */}
    <div className={styles.school}>
      {dice.map(item =>
        <Dice key={item} kind={item} />
      )}
      {schoolResults.map((index, result) =>
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
        {Object.keys(gameResults).map(key =>
          <div
            className={styles.combScore}
            key={key}
          >
            <div
              className={styles.combName}
            >
              {key}
            </div>
            {gameResults[key].map((value, index) =>
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
      {currentState.map((value, index) =>
        <Dice kind={value} key={value.toString() + index} />
      )}
      <button onClick={handleClick}>
        play
      </button>
    </div>
  </section>
}

export default GamePage
