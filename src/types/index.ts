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

export type ProfileFormErrors = FieldErrors<{
  name: string
  email: string
}>

export type UpdatePwdFormErrors = FieldErrors<{
  password: string
  confirm: string
  token: string
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

export interface iStats {
  average: number
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

export interface iNotification {
  message: Nullable<string>
  type?: Nullable<string>
  busy: boolean
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
export enum DiceStatus {
  ROLL = 'roll',
  SELECTED = 'selected'
}

export type Status = DiceStatus // Keep for backward compatibility during transition

export interface Dice {
  id: string
  status: DiceStatus
  value: number
}

export type BoardSections = Record<string, Dice[]>

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

export enum ToastTypes {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning'
}

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
