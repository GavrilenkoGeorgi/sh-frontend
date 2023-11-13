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

import { dropAnimation } from './DnDConstants'

import { type RootState } from '../../../store'
import { selectDice, deselectDice } from '../../../store/slices/shSlice'
import BoardSection from './BoardSection'
import DiceItem from './DiceItem'
import MainButton from './MainButton'
import styles from './DnDDiceBoard.module.sass'

export type Status = 'roll' | 'sel'

export interface Dice {
  id: string
  status: Status
  value: number
}

export type BoardSections = Record<string, Dice[]>

const diceArray: Dice[] = [
  {
    id: 'one',
    status: 'roll',
    value: 0
  },
  {
    id: 'two',
    status: 'roll',
    value: 0
  },
  {
    id: 'three',
    status: 'roll',
    value: 0
  },
  {
    id: 'four',
    status: 'roll',
    value: 0
  },
  {
    id: 'five',
    status: 'roll',
    value: 0
  }
]

export const getDiceByStatus = (dice: Dice[], status: Status): Dice[] => {
  return dice.filter((dice) => dice.status === status)
}

export const getDiceById = (dice: Dice[], id: string): Dice => {
  return dice.find((dice) => dice.id === id) as Dice
}

export const BOARD_SECTIONS = {
  sel: 'sel',
  roll: 'roll'
}

export const initializeBoard = (dice: Dice[]): BoardSections => {
  const boardSections: BoardSections = {}

  Object.keys(BOARD_SECTIONS).forEach((boardSectionKey) => {
    boardSections[boardSectionKey] = getDiceByStatus(
      dice,
      boardSectionKey as Status
    )
  })

  return boardSections
}

export const findBoardSectionContainer = (
  boardSections: BoardSections,
  id: string
): string => {
  if (id in boardSections) {
    return id
  }

  const container = Object.keys(boardSections).find((key) =>
    boardSections[key].find((item) => item.id === id)
  )
  return container as string
}

const DnDDiceBoard: FC = () => {
  const { game } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()

  useEffect(() => {

    const update = initialDice.filter(item => item.status === 'roll')
    game.roll.forEach((value, index) => {
      if (value > 0) {
        update[index].value = value
      }
    })

    const onHold = initialDice.filter(item => item.status === 'sel')
    setCurrState([...onHold, ...update])
  }, [game.roll])

  useEffect(() => {

    if (game.saved) {

      diceArray.forEach((item, index) => {
        diceArray[index].status = 'roll'
        diceArray[index].value = 0
      })
      const init = initializeBoard([...diceArray])

      setBoardSections(init)
      setCurrState([...diceArray])
    }

  }, [game.saved])

  const [initialDice, setCurrState] = useState<Dice[]>(diceArray)

  const initialBoardSections = initializeBoard(initialDice)
  const [boardSections, setBoardSections] =
    useState<BoardSections>(initialBoardSections)

  const [activeDiceId, setActiveDiceId] = useState<null | string>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

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
      (activeContainer.length === 0) ||
      (overContainer.length === 0) ||
      activeContainer === overContainer
    ) {
      return
    }

    setBoardSections((boardSection) => {
      const activeItems = boardSection[activeContainer]
      const overItems = boardSection[overContainer]

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      )
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
      (activeContainer.length === 0) ||
      (overContainer.length === 0) ||
      activeContainer !== overContainer
    ) {
      return
    }

    const activeIndex = boardSections[activeContainer].findIndex(
      (task) => task.id === active.id
    )
    const overIndex = boardSections[overContainer].findIndex(
      (task) => task.id === over?.id
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

    const activeDice = getDiceById(initialDice, active.id.toString())

    if (activeDice.status !== activeContainer) {
      if (activeContainer === 'sel') { // !
        dispatch(selectDice(activeDice.value))
        initialDice.forEach((item) => {
          if (activeDice.id === item.id) {
            item.status = activeContainer as Status
          }
        })
        setCurrState([...initialDice])
      } else {
        initialDice.forEach((item) => {
          if (activeDice.id === item.id) {
            item.status = activeContainer as Status
          }
        })

        const selected = initialDice.filter(item => item.status === 'roll')

        const data = {
          value: activeDice.value,
          order: selected.map(item => item.value)
        }

        setCurrState([...initialDice])
        dispatch(deselectDice(data)) // TODO: one thing!
      }
    }

    setActiveDiceId(null)
  }

  const item = (activeDiceId != null) ? getDiceById(initialDice, activeDiceId) : null

  return (
    <div className={styles.container}>
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
        <DragOverlay dropAnimation={dropAnimation}>
          {(item != null) ? <DiceItem dice={item} /> : null}
        </DragOverlay>
      </DndContext>
      <MainButton />
    </div>
  )
}

export default DnDDiceBoard
