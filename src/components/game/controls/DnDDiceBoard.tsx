import React, { type FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  DragOverlay
} from '@dnd-kit/core'

import { type RootState } from '../../../store'
import { selectDice, deselectDice } from '../../../store/slices/shSlice'
import type { Dice, Status, BoardSections } from '../../../types'
import {
  dropAnimation,
  diceArray,
  initializeBoard,
  findBoardSectionContainer,
  getDiceById
} from './DnDHelpers'
import BoardSection from './BoardSection'
import DiceItem from './DiceItem'
import MainButton from './MainButton'
import * as styles from './DnDDiceBoard.module.sass'

import { Portal } from '../../layout/Portal'

const DnDDiceBoard: FC = () => {
  const { game } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()
  const [diceState, setDiceState] = useState<Dice[]>(diceArray)

  const initialBoardSections = initializeBoard(diceState)
  const [boardSections, setBoardSections] =
    useState<BoardSections>(initialBoardSections)
  const [activeDiceId, setActiveDiceId] = useState<null | string>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // item to animate on interaction
  const item =
    activeDiceId != null ? getDiceById(diceState, activeDiceId) : null

  const handleDragStart = ({ active }: DragStartEvent): void => {
    setActiveDiceId(active.id as string)
  }

  const handleDragOver = ({ active, over }: DragOverEvent): void => {
    // Find the containers
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    )
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    )

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

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item) => item.id === active.id)
      const overIndex = overItems.findIndex((item) => item.id !== over?.id)

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
  }

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    )
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    )

    if (
      activeContainer.length === 0 ||
      overContainer.length === 0 ||
      activeContainer !== overContainer
    ) {
      return
    }

    const activeIndex = boardSections[activeContainer].findIndex(
      (dice) => dice.id === active.id
    )
    const overIndex = boardSections[overContainer].findIndex(
      (dice) => dice.id === over?.id
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

    const activeDice = getDiceById(diceState, active.id.toString())

    if (activeDice.status !== activeContainer) {
      // fix: immutable update instead of mutation
      const updatedDiceState = diceState.map((item) =>
        item.id === activeDice.id
          ? { ...item, status: activeContainer as Status }
          : item
      )

      if (activeContainer === 'sel') {
        dispatch(selectDice(activeDice.value))
        setDiceState(updatedDiceState)
      } else {
        const selected = updatedDiceState.filter(
          (item) => item.status === 'roll'
        )
        const data = {
          value: activeDice.value,
          order: selected.map((item) => item.value)
        }
        setDiceState(updatedDiceState)
        dispatch(deselectDice(data))
      }
    }

    setActiveDiceId(null)
  }

  useEffect(() => {
    // on roll immutable update for roll values
    const rollDice = diceState.filter((item) => item.status === 'roll')
    const holdDice = diceState.filter((item) => item.status === 'sel')

    const updatedRollDice = rollDice.map((item, index) => {
      if (game.roll[index] > 0) {
        return { ...item, value: game.roll[index] }
      }
      return item
    })

    // update if there were changes
    const hasChanges = updatedRollDice.some(
      (item, index) => item.value !== rollDice[index]?.value
    )

    if (hasChanges) {
      const newDiceState = [...holdDice, ...updatedRollDice]
      setDiceState(newDiceState)
      //  sync boardSections with diceState
      setBoardSections(initializeBoard(newDiceState))
    }
  }, [game.roll, initializeBoard, diceState, setBoardSections])

  useEffect(() => {
    if (game.saved || game.over) {
      const resetDiceArray = diceArray.map((item) => ({
        ...item,
        status: 'roll' as Status,
        value: 0
      }))

      const init = initializeBoard(resetDiceArray)
      setBoardSections(init)
      setDiceState(resetDiceArray)
    }
  }, [game.saved, game.over])

  return (
    <div className={styles.controls}>
      <div className={styles.boardSections}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {Object.keys(boardSections).map((boardSectionKey) => (
            <div key={boardSectionKey} className={styles.board}>
              <BoardSection
                id={boardSectionKey}
                title={boardSectionKey}
                dice={boardSections[boardSectionKey]}
              />
            </div>
          ))}
          {/* draggable item animation */}
          <Portal>
            <DragOverlay dropAnimation={dropAnimation}>
              {item != null ? <DiceItem dice={item} isDragging={true} /> : null}
            </DragOverlay>
          </Portal>
        </DndContext>
      </div>
      <MainButton />
    </div>
  )
}

export default DnDDiceBoard
