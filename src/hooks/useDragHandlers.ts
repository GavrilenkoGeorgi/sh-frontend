import { useState, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type UniqueIdentifier
} from '@dnd-kit/core'
import type { Dice, BoardSections } from '../types'
import { DiceStatus } from '../types'
import {
  findBoardSectionContainer,
  getDiceById
} from '../components/game/controls/DnDHelpers'

interface UseDragHandlersProps {
  diceState: Dice[]
  setDiceState: (dice: Dice[]) => void
  boardSections: BoardSections
  setBoardSections: (
    sections: BoardSections | ((prev: BoardSections) => BoardSections)
  ) => void
  onDiceSelect: (value: number) => void
  onDiceDeselect: (value: number, rollOrder: number[]) => void
}

export const useDragHandlers = ({
  diceState,
  setDiceState,
  boardSections,
  setBoardSections,
  onDiceSelect,
  onDiceDeselect
}: UseDragHandlersProps) => {
  const [activeDiceId, setActiveDiceId] = useState<UniqueIdentifier | null>(
    null
  )

  const handleDragStart = useCallback(({ active }: DragStartEvent): void => {
    setActiveDiceId(active.id)
  }, [])

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent): void => {
      // find the containers
      const activeContainer = findBoardSectionContainer(
        boardSections,
        active.id
      )
      const overContainer = findBoardSectionContainer(boardSections, over?.id)

      if (
        activeContainer.length === 0 ||
        overContainer.length === 0 ||
        activeContainer === overContainer
      ) {
        return
      }

      setBoardSections((boardSection) => {
        const activeItems = boardSection[activeContainer]
        const overItems = boardSection[overContainer]

        // find the indexes for the items
        const activeIndex = activeItems.findIndex(
          (item) => item.id === String(active.id)
        )
        const overIndex = overItems.findIndex(
          (item) => item.id !== String(over?.id)
        )

        return {
          ...boardSection,
          [activeContainer]: [
            ...boardSection[activeContainer].filter(
              (item) => item.id !== active.id
            )
          ],
          [overContainer]: [
            ...boardSection[overContainer].slice(0, overIndex),
            boardSections[activeContainer][activeIndex],
            ...boardSection[overContainer].slice(
              overIndex,
              boardSection[overContainer].length
            )
          ]
        }
      })
    },
    [boardSections, setBoardSections]
  )

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent): void => {
      const activeContainer = findBoardSectionContainer(
        boardSections,
        active.id
      )
      const overContainer = findBoardSectionContainer(boardSections, over?.id)

      if (
        activeContainer.length === 0 ||
        overContainer.length === 0 ||
        activeContainer !== overContainer
      ) {
        return
      }

      const activeIndex = boardSections[activeContainer].findIndex(
        (dice) => dice.id === String(active.id)
      )
      const overIndex = boardSections[overContainer].findIndex(
        (dice) => dice.id === String(over?.id)
      )

      if (activeIndex !== overIndex) {
        setBoardSections((boardSection) => ({
          ...boardSection,
          [overContainer]: arrayMove(
            boardSection[overContainer],
            activeIndex,
            overIndex
          )
        }))
      }

      const activeDice = getDiceById(diceState, active.id)

      if (activeDice.status !== activeContainer) {
        // immutable update instead of mutation
        const newStatus =
          activeContainer === DiceStatus.SELECTED
            ? DiceStatus.SELECTED
            : DiceStatus.ROLL
        const updatedDiceState = diceState.map((item) =>
          item.id === activeDice.id ? { ...item, status: newStatus } : item
        )

        if (activeContainer === DiceStatus.SELECTED) {
          onDiceSelect(activeDice.value)
          setDiceState(updatedDiceState)
        } else {
          const rollDice = updatedDiceState.filter(
            (item) => item.status === DiceStatus.ROLL
          )
          const rollOrder = rollDice.map((item) => item.value)
          setDiceState(updatedDiceState)
          onDiceDeselect(activeDice.value, rollOrder)
        }
      }

      setActiveDiceId(null)
    },
    [boardSections, diceState, setDiceState, onDiceSelect, onDiceDeselect]
  )

  // get the currently dragged item for animation
  const activeDice =
    activeDiceId != null ? getDiceById(diceState, activeDiceId) : null

  return {
    activeDiceId,
    activeDice,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  }
}
