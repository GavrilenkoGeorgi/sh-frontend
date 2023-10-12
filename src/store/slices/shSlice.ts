import { createSlice } from '@reduxjs/toolkit'
import ShScore from '../../utils/sh-score'
import { SchoolCombinations, GameCombinations } from '../../types'

const schoolCombNames = Object.values(SchoolCombinations)
const gameCombNames = Object.values(GameCombinations)

const school: Record<string, { final: boolean, score: number | null }> = {}
const gameCombinations: Record<string, number[]> = {}

schoolCombNames.forEach(name => {
  school[name] = {
    final: false,
    score: null
  }
})

gameCombNames.forEach(name => {
  gameCombinations[name] = new Array(3).fill(0)
})

const initialState = {
  game: {
    score: 0,
    turn: 0,
    lock: false,
    school,
    gameCombinations,
    selection: new Array(0),
    roll: new Array(5).fill(0)
  }
}

const shSlice = createSlice({
  name: 'sh',
  initialState,
  reducers: {
    setScore: ({ game }, action) => {
      if (game.turn <= 18) {
        const result = ShScore.getSchoolScore(action.payload)
        // clear all temp scores
        for (const key in game.school) {
          if (!game.school[key].final) {
            game.school[key].score = null
          }
        }
        // iterate results array and set scores
        result.forEach((value, index) => {
          if (value !== null && !game.school[Object.keys(game.school)[index]].final) {
            game.school[Object.keys(game.school)[index]].score = value
          }
        })
      } else {
        ShScore.getScore(game.selection)
      }
    },
    saveScore: ({ game }, action) => {
      if (game.turn <= 18) {
        game.school[action.payload].final = true
      }
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

export const {
  setScore,
  saveScore,
  rollDice,
  selectDice,
  deselectDice
} = shSlice.actions

export default shSlice.reducer
