import React, { type FC, type MouseEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useDrop } from 'react-dnd'

import { selectDice, deselectDice } from '../../store/slices/shSlice'
import type { iBoardProps, iDropItem } from '../../types'
import { ItemTypes } from './DraggableDice'
import styles from './DiceBoard.module.sass'

export const DiceBoard: FC<iBoardProps> = ({ id, children }: iBoardProps) => {

  const dispatch = useDispatch()

  const diceSelector = (id: string, kind: number): void => {
    switch (id) {
      case 'sel':
        dispatch(selectDice(kind))
        break
      case 'roll':
        dispatch(deselectDice(kind))
        break
      default:
        console.log('check id')
    }
  }

  // eslint-disable-next-line
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.DICE,
      drop (item: iDropItem) {
        if (item.parent !== id) {
          diceSelector(id, item.kind)
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      })
    }), [])

  // select/deselect on click
  const handleClick = (event: MouseEvent<HTMLElement>): void => {
    const el = event.target as HTMLElement
    const parent = String(el.closest('div')?.dataset.id)
    const kind = Number(el.closest('span')?.dataset.kind)

    if (parent === 'roll') {
      dispatch(selectDice(kind))
    } else {
      dispatch(deselectDice(kind))
    }
  }

  return (
    <div
      ref={drop}
      role='Space'
      data-id={id}
      className={styles.board}
      onClick={(event) => { handleClick(event) }}
    >
      {children}
    </div>
  )
}
