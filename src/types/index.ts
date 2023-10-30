import { type ReactNode } from 'react'
import { type FieldErrors } from 'react-hook-form/dist/types'

// Types
export type Nullable<T> = T | null

// forms
export type FocusedStates = Record<string, boolean>

export type InputValues = Record<string, string>

export type RegisterFormErrors = FieldErrors<{
  name: string
  email: string
  password: string
  confirm: string
}>

export type LoginFormErrors = FieldErrors<{
  email: string
  password: string
  name?: string
}>

// Interfaces
export interface IUser {
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
}

export interface ChartProps {
  width: number
  height: number
  margin?: { top: number, right: number, bottom: number, left: number }
}

export interface CombinationsBarData {
  id: string
  value: number
}

export interface iStats {
  average: number
  games: number
  max: number
  percentFromMax: number
  scores: number[]
}

export interface BaseChartProps {
  parentHeight: number
  parentWidth: number
  margin?: {
    top: number
    left: number
    right: number
    bottom: number
  }
}

// enums
export enum SchoolCombinations {
  ONES = 'ones',
  TWOS = 'twos',
  THREES = 'threes',
  FOURS = 'fours',
  FIVES = 'fives',
  SIXES = 'sixes'
}

export enum GameCombinations { // combination names?
  PAIR = 'pair',
  TWOPAIRS = 'twoPairs',
  TRIPLE = 'triple',
  FULL = 'full',
  QUADS = 'quads',
  POKER = 'poker',
  SMALL = 'small',
  LARGE = 'large',
  CHANCE = 'chance'
}
