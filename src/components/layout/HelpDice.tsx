import { type FC } from 'react'
import { type HelpDice } from '../../types'

import { Dice } from '../game/Dice'
import * as styles from './HelpDice.module.sass'

type Props = {
  data: HelpDice[] // TODO: update this type, needs autocomplete
}

const HelpDice: FC<Props> = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <div className={styles.table} key={item.name}>
          <p>{item.name}</p>
          <div className={styles.dice}>
            {item.dice.map((kind, index) => (
              <Dice kind={kind} key={`${item.name}-${index}`} />
            ))}
          </div>
          <div className={styles.value}>
            <span>{item.value}</span>
          </div>
        </div>
      ))}
    </>
  )
}

export default HelpDice
