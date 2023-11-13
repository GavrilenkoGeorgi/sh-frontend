import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import { type Dice } from './DnDDiceBoard'
import DiceItem from './DiceItem'
import SortableDiceItem from './SortableDiceItem'
import styles from './DnDDiceBoard.module.sass'

interface BoardSectionProps {
  id: string
  title: string
  dice: Dice[]
}

const BoardSection = ({ id, title, dice }: BoardSectionProps): React.JSX.Element => {
  const { setNodeRef } = useDroppable({
    id
  })

  return (
    <SortableContext
      id={id}
      items={dice}
      strategy={horizontalListSortingStrategy}
    >
      <div ref={setNodeRef}>
        {dice.map((item) => (
          <div key={item.id} className={styles.itemContainer}>
            <SortableDiceItem id={item.id}>
              <DiceItem dice={item} />
            </SortableDiceItem>
          </div>
        ))}
      </div>
    </SortableContext>
  )
}

export default BoardSection
