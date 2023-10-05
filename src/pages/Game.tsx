import React, { type FC } from 'react'
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

  return <section className={styles.game}>
    {/* School results */}
    <div className={styles.school}>
      {dice.map(item =>
        <Dice key ={item} kind={item} />
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
                key={`${key}-${value}-${index}`}
                className={styles.combResult}
              >
                {value}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </section>
}

export default GamePage
