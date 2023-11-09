import React, { type FC } from 'react'
import { useDrag } from 'react-dnd'

import { type iDraggableDice } from '../../types'
import Dice from './Dice'

export const ItemTypes = {
  DICE: 'dice'
}

const DraggableDice: FC<iDraggableDice> = ({ kind, parent }) => {

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.DICE,
      item: { kind, parent },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }), [])

  return <div
    ref={drag}
    style={{
      opacity: isDragging ? 0.5 : 1,
      width: '40px'
    }}
  >
    <Dice kind={kind} />
  </div>
}

export default DraggableDice
