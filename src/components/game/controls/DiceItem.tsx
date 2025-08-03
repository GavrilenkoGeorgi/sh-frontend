import React from 'react'
import { type Dice } from '../../../types'
import { Dice as DiceSVG } from '../Dice'
import { motion } from 'framer-motion'
import * as styles from './DnDDiceBoard.module.sass'

interface DiceItemProps {
  dice: Dice
  isDragging?: boolean
  shouldAnimate?: boolean
}

const DiceItem = ({
  dice,
  isDragging = false,
  shouldAnimate = false
}: DiceItemProps): React.JSX.Element => {
  // animate if shouldAnimate is true (for rolled dice with new values)
  const animationProps =
    isDragging || !shouldAnimate
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
    <motion.div
      key={`${dice.id}-${dice.status}-${dice.value}`}
      {...animationProps}
      layout={!isDragging && shouldAnimate}
    >
      <div className={styles.dice}>
        <DiceSVG kind={dice.value} />
      </div>
    </motion.div>
  )
}

export default DiceItem
