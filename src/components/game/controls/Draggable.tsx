import React, { type FC } from 'react'
import { useDraggable } from '@dnd-kit/core'

import { type iDropProps } from './Droppable'

const Draggable: FC<iDropProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable'
  })
  const style = transform !== null
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  )
}

export default Draggable
