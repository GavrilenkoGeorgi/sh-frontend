import React, { type FC } from 'react'

import HelpDice from '../components/layout/HelpDice'
import styles from './SharedStyles.module.sass'

import data from '../assets/data/HelpPage.json'

const Help: FC = () => {
  return <section className={styles.container}>
    <h1>Help</h1>
    <article>
      Each turn consists of a maximum of three rolls — the first roll to be
      made with all five dice. If the player elects to roll a second and
      third time, he may pick up and use any number of dice, providing a
      score is taken on the last roll. It is the skillful use of these
      two optional rolls of the dice that can turn an unlucky first or
      second roll into a high scoring turn.
    </article>
    <h2>Some example scores</h2>
    <aside className={styles.combinations}>
      <h3>School</h3>
      <HelpDice data={data.slice(0, 8)}/>
    </aside>
    <aside className={styles.combinations}>
      <h3>Game</h3>
      <HelpDice data={data.slice(-11)}/>
    </aside>
  </section>
}

export default Help
