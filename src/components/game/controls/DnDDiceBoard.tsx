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
import styles from './DnDDiceBoard.module.sass'

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

  const handleDragEnd = ({ active, over, collisions }: DragEndEvent): void => {
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
      if (activeContainer === 'sel') {
        dispatch(selectDice(activeDice.value))
        diceState.forEach((item) => {
          if (activeDice.id === item.id) {
            item.status = activeContainer as Status
          }
        })
        setDiceState([...diceState])
      } else {
        diceState.forEach((item) => {
          if (activeDice.id === item.id) {
            item.status = activeContainer as Status
          }
        })

        const selected = diceState.filter((item) => item.status === 'roll')

        const data = {
          value: activeDice.value,
          order: selected.map((item) => item.value)
        }

        setDiceState([...diceState])
        dispatch(deselectDice(data))
      }
    }

    setActiveDiceId(null)
  }

  useEffect(() => {
    // on roll
    const update = diceState.filter((item) => item.status === 'roll')
    game.roll.forEach((value, index) => {
      if (value > 0) {
        update[index].value = value
      }
    })

    const onHold = diceState.filter((item) => item.status === 'sel')
    setDiceState([...onHold, ...update])
  }, [game.roll])

  useEffect(() => {
    // on save // i guess we dont't need this here
    if (game.saved || game.over) {
      diceArray.forEach((item, index) => {
        diceArray[index].status = 'roll'
        diceArray[index].value = 0
      })

      const init = initializeBoard([...diceArray])
      setBoardSections(init)
      setDiceState([...diceArray])
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
            <DragOverlay
              dropAnimation={dropAnimation}
              className={styles.dragOverlayWrapper}
              adjustScale
            >
              {item != null ? <DiceItem dice={item} /> : null}
            </DragOverlay>
          </Portal>
        </DndContext>
      </div>
      <MainButton />
    </div>
  )
}

export default DnDDiceBoard
