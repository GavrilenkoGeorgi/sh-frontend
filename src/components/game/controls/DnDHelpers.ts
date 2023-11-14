import { type DropAnimation } from '@dnd-kit/core'
import type { Dice, Status, BoardSections } from '../../../types'

export const dropAnimation: DropAnimation = {
  duration: 300,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
}

export const diceArray: Dice[] = [
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

export const boardNames = {
  sel: 'sel',
  roll: 'roll'
}

export const getDiceByStatus = (dice: Dice[], status: Status): Dice[] => {
  return dice.filter((dice) => dice.status === status)
}

export const getDiceById = (dice: Dice[], id: string): Dice => {
  return dice.find((dice) => dice.id === id) as Dice
}

export const initializeBoard = (dice: Dice[]): BoardSections => {
  const boardSections: BoardSections = {}

  Object.keys(boardNames).forEach((boardSectionKey) => {
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
