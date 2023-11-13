import React, { type FC, type ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'

export interface iDropProps {
  children: ReactNode
}

const Droppable: FC<iDropProps> = (props) => {

  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable'
  })
  const style = {
    color: isOver ? 'green' : undefined
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}

export default Droppable
