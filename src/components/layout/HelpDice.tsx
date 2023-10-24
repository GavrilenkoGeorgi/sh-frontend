import React, { type FC } from 'react'
import { type iHelpDice } from '../../types'

import Dice from '../game/Dice'
import styles from './HelpDice.module.sass'

interface iProps {
  data: iHelpDice[]
}

const HelpDice: FC<iProps> = ({ data }) => {
  return <>
    {data.map(item =>
      <div className={styles.table} key={item.name}>
        <p>
          {item.name}
        </p>
        <div className={styles.dice}>
          {item.dice.map((kind, index) =>
            <Dice
              kind={kind}
              key={`${item.name}-${index}`}
          />)}
        </div>
        <div className={styles.value}>
          <span>{item.value}</span>
        </div>
      </div>
    )}
  </>
}

export default HelpDice
