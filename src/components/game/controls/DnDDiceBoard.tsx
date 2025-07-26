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
import { usePWALifecycle } from '../../../hooks/usePWALifecycle'

import { Portal } from '../../layout/Portal'

const DnDDiceBoard: FC = () => {
  const { game } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()
  const [diceState, setDiceState] = useState<Dice[]>(diceArray)

  const initialBoardSections = initializeBoard(diceState)
  const [boardSections, setBoardSections] =
    useState<BoardSections>(initialBoardSections)
  const [activeDiceId, setActiveDiceId] = useState<null | string>(null)

  // PWA lifecycle for the mobile devices
  usePWALifecycle({
    onAppVisible: () => {
      // when app becomes visible again retore state
      if (game.selection.length > 0 || game.roll.some((val) => val > 0)) {
        restoreDiceStateFromRedux()
      }
    }
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const restoreDiceStateFromRedux = () => {
    // create selected dice array preserving existing order
    const currentSelectedDice = boardSections.sel || []
    const restoredSelectedDice = game.selection.map((value, index) => {
      const existingDice = currentSelectedDice[index]
      return {
        id: existingDice?.id || diceArray[index].id,
        status: 'sel' as Status,
        value: value
      }
    })

    const restoredRollDice = game.roll
      .map((value, index) => {
        if (value > 0) {
          return {
            id: diceArray[game.selection.length + index].id,
            status: 'roll' as Status,
            value: value
          }
        }
        return null
      })
      .filter(Boolean) as Dice[]

    const restoredDiceArray = [...restoredSelectedDice, ...restoredRollDice]

    setBoardSections({
      sel: restoredSelectedDice,
      roll: restoredRollDice
    })
    setDiceState(restoredDiceArray)
  }

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
      // Fix: immutable update instead of mutation
      const updatedDiceState = diceState.map((item) =>
        item.id === activeDice.id
          ? { ...item, status: activeContainer as Status }
          : item
      )

      if (activeContainer === 'sel') {
        dispatch(selectDice(activeDice.value))
        setDiceState(updatedDiceState)
      } else {
        const rollDice = updatedDiceState.filter(
          (item) => item.status === 'roll'
        )
        const data = {
          value: activeDice.value,
          order: rollDice.map((item) => item.value)
        }
        setDiceState(updatedDiceState)
        dispatch(deselectDice(data))
      }
    }

    setActiveDiceId(null)
  }

  useEffect(() => {
    const rollDice = diceState.filter((item) => item.status === 'roll')
    const holdDice = diceState.filter((item) => item.status === 'sel')

    const updatedRollDice = game.roll
      .map((value, index) => {
        // find existing dice to preserve id
        const existingDice = rollDice[index]
        return {
          id: existingDice?.id || diceArray[game.selection.length + index].id,
          status: 'roll' as Status,
          value: value
        }
      })
      .filter((dice) => dice.value > 0)

    const hasRollChanges = updatedRollDice.some(
      (item, index) => !rollDice[index] || item.value !== rollDice[index].value
    )

    const updatedSelectedDice = game.selection.map((value, index) => ({
      id: holdDice[index]?.id || diceArray[index].id,
      status: 'sel' as Status,
      value: value
    }))

    if (hasRollChanges || holdDice.length !== updatedSelectedDice.length) {
      const newDiceState = [...updatedSelectedDice, ...updatedRollDice]
      setDiceState(newDiceState)

      // preserve existing order
      setBoardSections((prevBoardSections) => ({
        ...prevBoardSections,
        // update dice values while preserving positions
        sel:
          prevBoardSections.sel.length > 0
            ? prevBoardSections.sel
                .map(
                  (dice) =>
                    updatedSelectedDice.find(
                      (updatedDice) => updatedDice.id === dice.id
                    ) || dice
                )
                .filter((_, index) => index < game.selection.length)
            : updatedSelectedDice,
        // update 'roll' section with new values
        roll: updatedRollDice
      }))
    }
  }, [game.roll, game.selection])

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

  // fix: restore dice state
  useEffect(() => {
    if (game.selection.length > 0 || game.roll.some((val) => val > 0)) {
      restoreDiceStateFromRedux()
    }
  }, [])

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
