import { type ReactNode } from 'react'
import { type FieldErrors } from 'react-hook-form/dist/types'

// Types
export type Nullable<T> = T | null

// forms
export type FocusedStates = Record<string, boolean>

export type InputValues = Record<string, string>

export type RegisterFormErrors = FieldErrors<{
  username: string
  email: string
  password: string
  confirm: string
}>

export type LoginFormErrors = FieldErrors<{
  email: string
  password: string
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

// navbar
export interface ToggleBtnProps {
  open: boolean
}

// enums
export enum Combinations {
  ONES = 'ones',
  TWOS = 'twos',
  THREES = 'threes',
  FULL = 'full',
  QUADS = 'quads',
  POKER = 'poker',
  SMALL = 'small',
  LARGE = 'large',
  CHANCE = 'chance'
}
