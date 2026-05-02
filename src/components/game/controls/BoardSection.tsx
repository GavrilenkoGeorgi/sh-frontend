import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'

import { DiceStatus, type Dice } from '../../../types'
import DiceItem from './DiceItem'
import SortableDiceItem from './SortableDiceItem'
import * as styles from './DnDDiceBoard.module.sass'

interface BoardSectionProps {
  id: string
  title: string
  dice: Dice[]
  shouldAnimateNewDice?: boolean
  rollCount: number
}

const BoardSection = ({
  id,
  dice,
  shouldAnimateNewDice = false,
  rollCount = 0
}: BoardSectionProps): React.JSX.Element => {
  const { setNodeRef } = useDroppable({
    id
  })

  return (
    <SortableContext
      id={id}
      items={dice}
      strategy={horizontalListSortingStrategy}
    >
      <div ref={setNodeRef} className={styles.items}>
        {dice.map((item) => {
          const shouldAnimate = shouldAnimateNewDice && id === DiceStatus.ROLL
          return (
            <SortableDiceItem
              key={item.id}
              id={item.id}
              shouldAnimate={shouldAnimate}
            >
              <DiceItem
                dice={item}
                shouldAnimate={shouldAnimate}
                rollAnimationKey={rollCount}
              />
            </SortableDiceItem>
          )
        })}
      </div>
    </SortableContext>
  )
}

export default BoardSection
