import { createSlice } from '@reduxjs/toolkit'
import ShScore from '../../utils/sh-score'
import {
  SchoolCombinations,
  GameCombinations,
  type iCombination,
  type SaveScorePayload,
  isSchoolCombination,
  isGameCombination
} from '../../types'

const schoolCombNames = Object.values(SchoolCombinations)
const gameCombNames = Object.values(GameCombinations)

// create fresh state objects
const createSchoolState = () => {
  const school: Record<string, { final: boolean; score: number | null }> = {}
  schoolCombNames.forEach((name) => {
    school[name] = {
      final: false,
      score: null
    }
  })
  return school
}

const createCombinationsState = () => {
  const combinations: Record<string, number[]> = {}
  gameCombNames.forEach((name) => {
    combinations[name] = []
  })
  return combinations
}

const createResultsState = (): iCombination => ({
  pair: 0,
  twoPairs: 0,
  triple: 0,
  full: 0,
  quads: 0,
  poker: 0,
  small: 0,
  large: 0,
  chance: 0
})

// clear temporary scores
const clearTempSchoolScores = (
  school: Record<string, { final: boolean; score: number | null }>
) => {
  for (const key in school) {
    if (!school[key].final) {
      school[key].score = null
    }
  }
}

const clearTempResults = (results: iCombination) => {
  for (const name in results) {
    results[name as keyof typeof results] = 0
  }
}

const initialState = {
  game: {
    score: 0,
    schoolScore: 0, // it can be negative
    turn: 1,
    rollCount: 0,
    lock: false,
    school: createSchoolState(),
    combinations: createCombinationsState(),
    results: createResultsState(),
    selection: [] as number[],
    roll: [0, 0, 0, 0, 0],
    saved: false,
    over: false,
    favDiceValues: [0, 0, 0, 0, 0, 0],
    stats: {}
  }
}

const shSlice = createSlice({
  name: 'sh',
  initialState,
  reducers: {
    reset: (state) => {
      state.game = {
        score: 0,
        schoolScore: 0,
        turn: 1,
        rollCount: 0,
        lock: false,
        school: createSchoolState(),
        combinations: createCombinationsState(),
        results: createResultsState(),
        selection: [],
        roll: [0, 0, 0, 0, 0],
        saved: false,
        over: false,
        favDiceValues: [0, 0, 0, 0, 0, 0],
        stats: {}
      }
    },
    setScore: ({ game }, action) => {
      if (game.turn <= 6) {
        clearTempSchoolScores(game.school)
        const result = ShScore.getSchoolScore(action.payload)
        // iterate results array and set scores
        result.forEach((value, index) => {
          if (
            value !== null &&
            !game.school[Object.keys(game.school)[index]].final
          ) {
            game.school[Object.keys(game.school)[index]].score = value
          }
        })
      } else if (game.turn <= 33) {
        const result = ShScore.getScore(ShScore.sort(action.payload))

        // clear all temp combination results first
        clearTempResults(game.results)

        // only set scores if there's a selection and result has values
        if (action.payload.length > 0) {
          for (const name in result) {
            if (game.combinations[name].length < 3) {
              game.results[name as keyof typeof game.results] =
                result[name as keyof typeof game.results]
            }
          }
        }
      }
    },
    saveScore: ({ game }, { payload }: { payload: SaveScorePayload }) => {
      if (
        game.rollCount > 0 &&
        game.turn <= 6 &&
        isSchoolCombination(payload)
      ) {
        // save 'training' score
        if (
          game.school[payload].score !== null &&
          !game.school[payload].final
        ) {
          game.school[payload].final = true
          // result can be a zero value, so we need this to be null
          game.score = game.score + game.school[payload].score
          game.saved = true
        }
        // clear all temp scores
        clearTempSchoolScores(game.school)
        // save 'school end' score to stats at 6th turn
        if (game.turn === 6) {
          game.schoolScore = game.score
        }
      } else if (
        game.rollCount > 0 &&
        game.turn > 6 &&
        isGameCombination(payload) &&
        game.combinations[payload].length < 3 // Check if combination hasn't been saved 3 times
      ) {
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
        clearTempResults(game.results)
        game.saved = true
      }

      if (game.saved) {
        // reset selection and unlock next turn
        game.selection.length = 0
        game.roll.splice(0, game.roll.length, 0, 0, 0, 0, 0)
        // unlock button
        game.turn = game.turn + 1
        game.rollCount = 0
        game.lock = false
      }

      // last turn
      if (game.turn === 34) {
        const stats = ShScore.combinationsStats(game.combinations)
        game.stats = { ...stats }
      }
    },
    gameOver: ({ game }) => {
      if (game.rollCount === 3 && game.turn <= 6) {
        // check if unable to complete training
        const dice = [...game.selection, ...game.roll]
        const scores = ShScore.getSchoolScore(dice)
        let canSave: boolean = false
        // check if user missed something
        Object.keys(game.school).forEach((key, index) => {
          if (!game.school[key].final && game.school[key].score === null) {
            // check if score is null in results
            if (scores[index] != null) canSave = true
          }
        })
        if (!canSave) game.over = true
      }
    },
    selectDice: ({ game }, { payload }) => {
      game.selection.push(payload) // add to selection
      game.roll.splice(game.roll.indexOf(payload), 1) // remove from roll
    },
    deselectDice: ({ game }, { payload }) => {
      // sync roll array - avoid direct assignment, use splice instead
      game.roll.splice(0, game.roll.length, ...payload.order)
      game.selection.splice(game.selection.indexOf(payload.value), 1) // remove from selection
      if (game.selection.length === 0) {
        // reset score if no selection
        clearTempSchoolScores(game.school)
        clearTempResults(game.results)
      }
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
  reset,
  gameOver,
  setScore,
  saveScore,
  rollDice,
  selectDice,
  deselectDice
} = shSlice.actions

export default shSlice.reducer
