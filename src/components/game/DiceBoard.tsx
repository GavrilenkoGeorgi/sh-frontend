import React, { type FC } from 'react'
import { useDispatch } from 'react-redux'
import { useDrop } from 'react-dnd'

import { selectDice, deselectDice } from '../../store/slices/shSlice'

import { ItemTypes } from './DraggableDice'
import styles from './DiceBoard.module.sass'

import type { iBoardProps, iDropItem } from '../../types'

export const DiceBoard: FC<iBoardProps> = ({ id, children }: iBoardProps) => {

  const dispatch = useDispatch()

  // eslint-disable-next-line
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.DICE,
      drop (item: iDropItem) {
        if (item.parent !== id) {
          switch (id) {
            case 'sel':
              dispatch(selectDice(item.kind))
              break
            case 'roll':
              dispatch(deselectDice(item.kind))
              break
            default:
              return false
          }
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      })
    }), [])

  return (
    <div
      ref={drop}
      role='Space'
      className={styles.board}
    >
      {children}
    </div>
  )
}
