import { createSlice } from '@reduxjs/toolkit'
import ShScore from '../../utils/sh-score'
import { SchoolCombinations, GameCombinations, type iCombination } from '../../types'

const schoolCombNames = Object.values(SchoolCombinations)
const gameCombNames = Object.values(GameCombinations)

const school: Record<string, { final: boolean, score: number | null }> = {}
const combinations: Record<string, number[]> = {}

// these are saved results
const results: iCombination = {
  pair: 0,
  twoPairs: 0,
  triple: 0,
  full: 0,
  quads: 0,
  poker: 0,
  small: 0,
  large: 0,
  chance: 0
}

schoolCombNames.forEach(name => {
  school[name] = {
    final: false,
    score: null
  }
})

gameCombNames.forEach(name => {
  combinations[name] = []
})

const initialState = {
  game: {
    score: 0,
    turn: 19,
    lock: false,
    school, // school is a bit different than main game result as it contains only one value
    combinations, // saved combinations values
    results, // combinations values to show
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
        const result = ShScore.getScore(game.selection)
        for (const name in result) {
          game.results[name as keyof typeof game.results] =
            result[name as keyof typeof game.results]
        }
      }
    },
    saveScore: ({ game }, action) => {
      if (game.turn <= 18) {
        game.school[action.payload].final = true
      } else {
        const value = game.results[action.payload as keyof typeof game.results]
        game.combinations[action.payload].push(value)
        // clear preliminary results to initial after save
        game.results = results
      }
    },
    selectDice: ({ game }, action) => {
      game.selection.push(action.payload) // add to selection
      game.roll.splice(game.roll.indexOf(action.payload), 1) // remove from roll
    },
    deselectDice: ({ game }, action) => {
      game.roll.push(action.payload) // add to roll array
      game.selection.splice(game.selection.indexOf(action.payload), 1) // remove from selection
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
