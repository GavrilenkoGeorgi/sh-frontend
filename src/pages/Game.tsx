import React, { type FC } from 'react'

import Dice from '../components/Dice'
import styles from './Game.module.sass'

const GamePage: FC = () => {
  return <section className={styles.game}>
    <div className={styles.dice}>
      <Dice kind={1} />
      <Dice kind={2} />
      <Dice kind={3} />
      <Dice kind={4} />
      <Dice kind={5} />
      <Dice kind={6} />
    </div>
  </section>
}

export default GamePage
