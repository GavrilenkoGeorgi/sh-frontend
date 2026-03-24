import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { type Dice } from '../../../types'
import { Dice as DiceSVG } from '../Dice'
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
  const animationProps: Pick<
    HTMLMotionProps<'div'>,
    'initial' | 'animate' | 'transition'
  > = isDragging || !shouldAnimate
    ? {}
    : {
        initial: { y: -10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20
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
