import { createSlice } from '@reduxjs/toolkit'
import ShScore from '../../utils/sh-score'
import { Combinations } from '../../types'

const names = Object.values(Combinations)
const game: Record<string, number[]> = {}

names.forEach(name => {
  game[name] = new Array(3).fill(0)
})

const initialState = {
  gameScore: {
    school: new Array(6).fill(0),
    game,
    roll: new Array(5).fill(0)
  }
}

const shSlice = createSlice({
  name: 'sh',
  initialState,
  reducers: {
    setScore: (state, action) => {
      console.log('Set score action', action)
    },
    rollDice: (state, action) => {
      const roll = ShScore.rollDice()
      state.gameScore.roll = roll
    }
  }
})

export const { setScore, rollDice } = shSlice.actions

export default shSlice.reducer
