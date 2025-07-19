import React from 'react'
import { type Dice } from '../../../types'
import { Dice as DiceSVG } from '../Dice'
import { motion } from 'framer-motion'
import * as styles from './DnDDiceBoard.module.sass'

interface DiceItemProps {
  dice: Dice
  isDragging?: boolean
}

const DiceItem = ({
  dice,
  isDragging = false
}: DiceItemProps): React.JSX.Element => {
  // disable fmotion animations during drag to prevent transform conflicts
  const animationProps = isDragging
    ? {}
    : {
        initial: { y: -10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: {
          duration: 2,
          ease: [0.6, -0.05, 0.01, 0.99],
          type: 'spring',
          stiffness: 300
        }
      }

  return (
    <motion.div key={dice.id + dice.value} {...animationProps}>
      <div className={styles.dice}>
        <DiceSVG kind={dice.value} />
      </div>
    </motion.div>
  )
}

export default DiceItem
