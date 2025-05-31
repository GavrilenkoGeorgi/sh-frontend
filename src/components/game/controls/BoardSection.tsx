import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'

import { type Dice } from '../../../types'
import DiceItem from './DiceItem'
import SortableDiceItem from './SortableDiceItem'
import * as styles from './DnDDiceBoard.module.sass'

interface BoardSectionProps {
  id: string
  title: string
  dice: Dice[]
}

const BoardSection = ({ id, dice }: BoardSectionProps): React.JSX.Element => {
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
            <DiceItem dice={item} />
          </SortableDiceItem>
        ))}
      </div>
    </SortableContext>
  )
}

export default BoardSection
