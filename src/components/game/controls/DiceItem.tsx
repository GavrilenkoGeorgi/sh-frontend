import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
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
  const controls = useAnimation()
  const wasAnimating = useRef(false)

  // trigger slide-down animation for all dice when a new roll occurs
  useEffect(() => {
    if (shouldAnimate && !isDragging && !wasAnimating.current) {
      controls.set({ y: -10, opacity: 0 })
      controls.start({
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20
        }
      })
    }
    wasAnimating.current = shouldAnimate
  }, [shouldAnimate, isDragging, controls])

  return (
    <motion.div animate={controls}>
      <div className={styles.dice}>
        <DiceSVG kind={dice.value} />
      </div>
    </motion.div>
  )
}

export default DiceItem
