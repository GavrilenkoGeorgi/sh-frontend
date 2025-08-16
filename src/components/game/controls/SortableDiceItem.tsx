import React, { type ReactElement } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { UniqueIdentifier } from '@dnd-kit/core'

interface SortableDiceItemProps {
  children: React.ReactNode
  id: UniqueIdentifier
}

const SortableDiceItem = ({
  children,
  id
}: SortableDiceItemProps): ReactElement => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label="Dice"
    >
      {children}
    </div>
  )
}

export default SortableDiceItem
