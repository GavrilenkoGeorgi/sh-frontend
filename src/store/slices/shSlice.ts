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
    turn: 1,
    rollCount: 0,
    lock: false,
    school, // school is a bit different than main game result as it contains only one value
    combinations, // saved combinations values
    results, // combinations values to show
    selection: new Array(0),
    roll: new Array(5).fill(0),
    saved: false,
    favDiceValues: new Array(6).fill(0),
    endGameResult: {
      stats: {},
      score: 0,
      favDiceValues: []
    }
  }
}

const shSlice = createSlice({
  name: 'sh',
  initialState,
  reducers: {
    setScore: ({ game }, action) => {
      if (game.turn <= 6) {
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
        const result = ShScore.getScore(ShScore.sort(game.selection))
        for (const name in result) {
          if (game.combinations[name].length < 3) {
            game.results[name as keyof typeof game.results] =
            result[name as keyof typeof game.results]
          }
        }
      }
    },
    saveScore: ({ game }, { payload }) => {
      if (game.rollCount > 0 && game.turn <= 6 && schoolCombNames.includes(payload)) { // save 'school' score
        if (game.school[payload].score !== null) {
          game.school[payload].final = true
          // @ts-expect-error: result can be a zero value, so we need this to be null
          game.score = game.score + game.school[payload].score
          game.saved = true
        }
      } else if (game.rollCount > 0 && game.turn > 6 && gameCombNames.includes(payload)) {
        // click on combination name saves zero
        // click on result saves current result
        const value = game.results[payload as keyof typeof game.results]
        game.combinations[payload].push(value)
        game.score = game.score + value
        // save favourite dice values from this selection
        for (const value of game.selection) {
          game.favDiceValues[value - 1]++
        }
        // clear preliminary results to initial after save
        game.results = results
        game.saved = true
      }

      if (game.saved) {
        // reset selection and unlock next turn
        game.selection = new Array(0)
        game.roll = new Array(5).fill(0)
        // unlock button
        game.turn = game.turn + 1
        game.rollCount = 0
        game.lock = false
      }
    },
    endGame: ({ game }) => {
      game.endGameResult = {
        stats: ShScore.combinationsStats(game.combinations),
        score: game.score,
        favDiceValues: game.favDiceValues as []
      }
    },
    selectDice: ({ game }, { payload }) => {
      game.selection.push(payload) // add to selection
      game.roll.splice(game.roll.indexOf(payload), 1) // remove from roll
    },
    deselectDice: ({ game }, { payload }) => {
      game.roll.push(payload) // add to roll array
      game.selection.splice(game.selection.indexOf(payload), 1) // remove from selection
    },
    rollDice: ({ game }) => {
      game.saved = false
      const newRoll = ShScore.rollDice(game.roll, game.selection)
      game.roll = newRoll
      game.rollCount = game.rollCount + 1
      if (game.rollCount === 3) game.lock = true
    }
  }
})

export const {
  setScore,
  saveScore,
  rollDice,
  selectDice,
  deselectDice,
  endGame
} = shSlice.actions

export default shSlice.reducer
