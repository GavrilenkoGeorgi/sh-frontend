import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '..'

const STORAGE_KEY = 'sh-tour-storage'

interface TourState {
  hasSeenGameTour: boolean
}

// rehydrate from localStorage
const loadPersistedState = (): TourState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { hasSeenGameTour: parsed.hasSeenGameTour === true }
    }
  } catch {
    // ignore corrupted data
  }
  return { hasSeenGameTour: false }
}

const persistState = (state: TourState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable
  }
}

const initialState: TourState = loadPersistedState()

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    markGameTourSeen: (state) => {
      state.hasSeenGameTour = true
      persistState(state)
    },
    resetGameTour: (state) => {
      state.hasSeenGameTour = false
      persistState(state)
    }
  }
})

export const { markGameTourSeen, resetGameTour } = tourSlice.actions

export const selectHasSeenGameTour = (state: RootState) =>
  state.tour.hasSeenGameTour

export default tourSlice.reducer
