import React from 'react'
import { type Dice } from './DnDDiceBoard'
import { Dice as DiceSVG } from '../Dice'
import styles from './DnDDiceBoard.module.sass'

interface DiceItemProps {
  dice: Dice
}

const DiceItem = ({ dice }: DiceItemProps): React.JSX.Element => {
  return <div className={styles.item}>
      <DiceSVG kind={dice.value} />
    </div>
}

export default DiceItem
