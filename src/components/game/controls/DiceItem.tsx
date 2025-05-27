import React from 'react'
import { type Dice } from '../../../types'
import { Dice as DiceSVG } from '../Dice'
import { motion } from 'framer-motion'
import styles from './DnDDiceBoard.module.sass'

interface DiceItemProps {
  dice: Dice
}

const DiceItem = ({ dice }: DiceItemProps): React.JSX.Element => {
  return (
    <motion.div
      key={dice.id + dice.value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 2,
        ease: [0.6, -0.05, 0.01, 0.99],
        type: 'spring',
        stiffness: 300
      }}
    >
      <div className={styles.dice}>
        <DiceSVG kind={dice.value} />
      </div>
    </motion.div>
  )
}

export default DiceItem
