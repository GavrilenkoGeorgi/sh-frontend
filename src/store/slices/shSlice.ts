import { createSlice } from '@reduxjs/toolkit'
import ShScore from '../../utils/sh-score'
import { Combinations } from '../../types'

const names = Object.values(Combinations)
const combinations: Record<string, number[]> = {}

names.forEach(name => {
  combinations[name] = new Array(3).fill(0)
})

const initialState = {
  game: {
    score: 0,
    turn: 0,
    lock: false,
    school: new Array(6).fill(0),
    combinations,
    selection: new Array(0),
    roll: new Array(5).fill(0)
  }
}

const shSlice = createSlice({
  name: 'sh',
  initialState,
  reducers: {
    setScore: ({ game }, action) => {
      ShScore.getScore(game.selection)
    },
    selectDice: ({ game }, action) => {
      // add to selection
      game.selection.push(action.payload)
      // remove from roll
      game.roll.splice(game.roll.indexOf(action.payload), 1)
    },
    deselectDice: ({ game }, action) => {
      // add to roll array
      game.roll.push(action.payload)
      // remove from selection
      game.selection.splice(game.selection.indexOf(action.payload), 1)
    },
    rollDice: ({ game }) => {
      const newRoll = ShScore.rollDice(game.roll, game.selection)
      game.roll = newRoll
      game.turn = game.turn + 1
      if (game.turn % 3 === 0) game.lock = true
    }
  }
})

export const { setScore, rollDice, selectDice, deselectDice } = shSlice.actions

export default shSlice.reducer
