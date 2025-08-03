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
}

const BoardSection = ({
  id,
  dice,
  shouldAnimateNewDice = false
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
        {dice.map((item) => (
          <SortableDiceItem key={item.id} id={item.id}>
            <DiceItem
              dice={item}
              shouldAnimate={shouldAnimateNewDice && id === DiceStatus.ROLL}
            />
          </SortableDiceItem>
        ))}
      </div>
    </SortableContext>
  )
}

export default BoardSection
