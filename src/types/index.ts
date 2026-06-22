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

export interface NavLink {
  label: string
  url: string
  disabled?: boolean
}

export interface Combination {
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

export interface HelpDice {
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
  mode: 'lastN' | 'dateRange' | 'all'
  lastN?: number
  dateFrom?: string
  dateTo?: string
  minScore?: number
}

export interface StatsSummary {
  games: number
  max: number
  average: number
  schoolAverage: number | null
  percentFromMax: number
}

export interface ScoreChartData {
  timestamp: string
  value: number
}

export interface Stats {
  summary: StatsSummary
  scores: ScoreChartData[]
  schoolScores: ScoreChartData[]
  favDiceValues: ChartAxisData[]
  favComb: ChartAxisData[]
  filter?: StatsFilterParams
}

export interface ChartAxisData {
  id: string
  value: number
}

export interface ChartProps {
  data: ChartAxisData[]
  syncId?: string
  referenceValue?: number | null
}

export interface CanSaveProps {
  final: boolean
  score: number | null
}

export interface ProgressBar {
  count: number
}

export interface Notification {
  message: Nullable<string>
  type?: Nullable<string>
  busy: boolean
  autoClose: boolean
}

export interface ErrorMessage {
  data: {
    message: string
    stack: string
    name?: string
    issues?: object[]
  }
  status: string
}

export interface CustomError extends Error {
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
