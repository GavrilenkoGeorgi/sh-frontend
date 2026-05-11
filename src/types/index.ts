import { UniqueIdentifier } from '@dnd-kit/core'
import { type ReactNode } from 'react'

// Types
export type Nullable<T> = T | null

// forms
export type FocusedStates = Record<string, boolean>

// Interfaces
export interface User {
  _id: string
  name: string
  email: string
}

export interface AuthProviderProps {
  children: ReactNode
}

export interface IAuth {
  token: string | null
  setToken: (token: string) => void
}

export interface navLink {
  label: string
  url: string
  disabled?: boolean
}

export interface iCombination {
  pair: number
  twoPairs: number
  triple: number
  full: number
  quads: number
  poker: number
  small: number
  large: number
  chance: number
}

export interface iHelpDice {
  name: string
  dice: number[]
  value: string
}

// navbar
export interface ToggleBtnProps {
  open: boolean
  onClick: () => void
}

export interface StatsFilterParams {
  mode: 'lastN' | 'dateRange'
  lastN?: number
  dateFrom?: string
  dateTo?: string
  minScore?: number
}

export interface Stats {
  average: number
  schoolAverage: number
  games: number
  max: number
  percentFromMax: number
  scores: ChartAxisData[]
  schoolScores: ChartAxisData[]
  favDiceValues: ChartAxisData[]
  favComb: ChartAxisData[]
}

export interface ChartAxisData {
  id: string
  value: number
}

export interface ChartProps {
  data: ChartAxisData[]
  syncId?: string
  referenceValue?: number
}

export interface CanSaveProps {
  final: boolean
  score: number | null
}

export interface iProgressBar {
  count: number
}

export interface iDraggableDice {
  kind: number
  parent?: string
}

export interface iBoardProps {
  id: string
  children?: ReactNode
}

export interface iDropItem {
  kind: number
  parent: string
}

export interface Notification {
  message: Nullable<string>
  type?: Nullable<string>
  busy: boolean
  autoClose: boolean
}

export interface iErrorMessage {
  data: {
    message: string
    stack: string
    name?: string
    issues?: object[]
  }
  status: string
}

export interface iError extends Error {
  status: string
  error: string
}

// Drag and drop controls
export const DiceStatus = {
  ROLL: 'roll',
  SELECTED: 'selected'
} as const
export type DiceStatus = (typeof DiceStatus)[keyof typeof DiceStatus]

export type Status = DiceStatus // Keep for backward compatibility during transition

export interface Dice {
  id: UniqueIdentifier
  status: DiceStatus
  value: number
}

export type BoardSections = Record<string, Dice[]>

// enums
export const SchoolCombinations = {
  ONES: 'ones',
  TWOS: 'twos',
  THREES: 'threes',
  FOURS: 'fours',
  FIVES: 'fives',
  SIXES: 'sixes'
} as const
export type SchoolCombinations =
  (typeof SchoolCombinations)[keyof typeof SchoolCombinations]

export const GameCombinations = {
  // combination names?
  PAIR: 'pair',
  TWOPAIRS: 'twoPairs',
  TRIPLE: 'triple',
  FULL: 'full',
  QUADS: 'quads',
  POKER: 'poker',
  SMALL: 'small',
  LARGE: 'large',
  CHANCE: 'chance'
} as const
export type GameCombinations =
  (typeof GameCombinations)[keyof typeof GameCombinations]

export const ToastTypes = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning'
} as const
export type ToastTypes = (typeof ToastTypes)[keyof typeof ToastTypes]

// action payload types
export type SaveScorePayload = SchoolCombinations | GameCombinations

// type guards
export function isSchoolCombination(
  value: string
): value is SchoolCombinations {
  return Object.values(SchoolCombinations).includes(value as SchoolCombinations)
}

export function isGameCombination(value: string): value is GameCombinations {
  return Object.values(GameCombinations).includes(value as GameCombinations)
}
