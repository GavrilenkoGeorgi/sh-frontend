import { type DropAnimation } from '@dnd-kit/core'
import type { Dice, BoardSections } from '../../../types'
import { DiceStatus } from '../../../types'

export const dropAnimation: DropAnimation = {
  duration: 300,
  easing: 'cubic-bezier(.12, .17, .78, .37)'
}

export const diceArray: Dice[] = [
  {
    id: 'one',
    status: DiceStatus.ROLL,
    value: 0
  },
  {
    id: 'two',
    status: DiceStatus.ROLL,
    value: 0
  },
  {
    id: 'three',
    status: DiceStatus.ROLL,
    value: 0
  },
  {
    id: 'four',
    status: DiceStatus.ROLL,
    value: 0
  },
  {
    id: 'five',
    status: DiceStatus.ROLL,
    value: 0
  }
]

export const boardNames = {
  selected: DiceStatus.SELECTED,
  roll: DiceStatus.ROLL
}

export const getDiceByStatus = (dice: Dice[], status: DiceStatus): Dice[] => {
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
      boardNames[boardSectionKey as keyof typeof boardNames]
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
