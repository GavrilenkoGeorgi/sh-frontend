import React, { type ReactNode } from 'react'
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core'

interface DnDContextWrapperProps {
  children: ReactNode
  onDragStart: (event: DragStartEvent) => void
  onDragOver: (event: DragOverEvent) => void
  onDragEnd: (event: DragEndEvent) => void
}

const DnDContextWrapper = ({
  children,
  onDragStart,
  onDragOver,
  onDragEnd
}: DnDContextWrapperProps): React.JSX.Element => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  )
}

export default DnDContextWrapper
