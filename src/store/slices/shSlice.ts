// store/sh/shSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import ShScore from '../../utils/sh-score'
import {
  SchoolCombinations,
  GameCombinations,
  type iCombination,
  type SaveScorePayload,
  isSchoolCombination,
  isGameCombination
} from '../../types'

// constants
const DICE_COUNT = 5
const MAX_ROLLS = 3
const SCHOOL_TURNS = 6
export const MAX_TURNS = 34
const MAX_SAVES_PER_COMBINATION = 3

const schoolCombNames = Object.values(SchoolCombinations)
const gameCombNames = Object.values(GameCombinations)

// types
type SchoolCell = { final: boolean; score: number | null }
type CombinationsState = Record<string, number[]>
type SchoolState = Record<string, SchoolCell>

export interface GameState {
  score: number
  schoolScore: number
  turn: number
  rollCount: number
  lock: boolean
  school: SchoolState
  combinations: CombinationsState
  results: iCombination
  // selection now stores dice indices (0..DICE_COUNT-1)
  selection: number[]
  // visual order of selected dice (same members as selection, but user-reorderable)
  selectionOrder: number[]
  // roll stores dice faces, length === DICE_COUNT
  roll: number[]
  saved: boolean
  over: boolean
  favDiceValues: number[] // length 6 (faces 1..6)
  stats: Record<string, any>
}

const createSchoolState = (): SchoolState => {
  const school: SchoolState = {} as SchoolState
  schoolCombNames.forEach((name) => {
    school[name] = { final: false, score: null }
  })
  return school
}

const createCombinationsState = (): CombinationsState => {
  const combinations: CombinationsState = {}
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

const zeroRoll = () => Array(DICE_COUNT).fill(0)
const zeroFavDiceValues = () => Array(6).fill(0)

const initialState: { game: GameState } = {
  game: {
    score: 0,
    schoolScore: 0,
    turn: 1,
    rollCount: 0,
    lock: false,
    school: createSchoolState(),
    combinations: createCombinationsState(),
    results: createResultsState(),
    selection: [],
    selectionOrder: [],
    roll: zeroRoll(),
    saved: false,
    over: false,
    favDiceValues: zeroFavDiceValues(),
    stats: {}
  }
}

const clearTempSchoolScores = (school: SchoolState) => {
  for (const name of schoolCombNames) {
    if (!school[name].final) school[name].score = null
  }
}

const clearTempResults = (results: iCombination) => {
  for (const k in results) results[k as keyof typeof results] = 0
}

const shSlice = createSlice({
  name: 'sh',
  initialState,
  reducers: {
    reset: (state) => {
      state.game = {
        ...initialState.game
      }
    },

    // payload: current dice (e.g. roll + selection combined?) — keep original contract
    setScore: (state, action: PayloadAction<number[]>) => {
      const { game } = state
      if (game.turn <= SCHOOL_TURNS) {
        clearTempSchoolScores(game.school)
        const result = ShScore.getSchoolScore(action.payload)
        // use stable schoolCombNames order
        result.forEach((value, index) => {
          const combName = schoolCombNames[index]
          if (value !== null && !game.school[combName].final) {
            game.school[combName].score = value
          }
        })
      } else if (game.turn <= MAX_TURNS - 1) {
        const result = ShScore.getScore(ShScore.sort(action.payload))
        clearTempResults(game.results)

        if (action.payload.length > 0) {
          for (const name of gameCombNames) {
            if (game.combinations[name].length < MAX_SAVES_PER_COMBINATION) {
              game.results[name as keyof typeof game.results] =
                result[name as keyof typeof game.results]
            }
          }
        }
      }
    },

    saveScore: (state, action: PayloadAction<SaveScorePayload>) => {
      const { game } = state
      const payload = action.payload as SaveScorePayload

      if (
        game.rollCount > 0 &&
        game.turn <= SCHOOL_TURNS &&
        isSchoolCombination(payload)
      ) {
        const cell = game.school[payload]
        if (cell.score !== null && !cell.final) {
          cell.final = true
          game.score += cell.score
          game.saved = true
        }
        clearTempSchoolScores(game.school)
        if (game.turn === SCHOOL_TURNS) {
          game.schoolScore = game.score
        }
      } else if (
        game.rollCount > 0 &&
        game.turn > SCHOOL_TURNS &&
        isGameCombination(payload) &&
        game.combinations[payload].length < MAX_SAVES_PER_COMBINATION
      ) {
        // value from results
        const value = game.results[payload as keyof typeof game.results]
        game.combinations[payload].push(value)
        game.score += value

        // update fav dice using selection indices (safe)
        for (const dieIndex of game.selection) {
          const face = game.roll[dieIndex]
          if (face && face >= 1 && face <= 6) game.favDiceValues[face - 1]++
        }
        clearTempResults(game.results)
        game.saved = true
      }

      if (game.saved) {
        // reset selection and roll
        game.selection.length = 0
        game.selectionOrder.length = 0
        game.roll.splice(0, game.roll.length, ...zeroRoll())
        game.turn++
        game.rollCount = 0
        game.lock = false
      }

      // compute stats at end of game
      if (game.turn === MAX_TURNS) {
        game.stats = { ...ShScore.combinationsStats(game.combinations) }
      }
    },

    gameOver: (state) => {
      const { game } = state
      if (game.rollCount === MAX_ROLLS && game.turn <= SCHOOL_TURNS) {
        // game.roll has all 5 dice values in the index-based model
        const scores = ShScore.getSchoolScore([...game.roll])
        let canSave = false
        schoolCombNames.forEach((key, index) => {
          if (!game.school[key].final && game.school[key].score === null) {
            if (scores[index] != null) canSave = true
          }
        })
        if (!canSave) game.over = true
      }
    },

    // select/deselect by index (0..DICE_COUNT-1)
    selectDice: (state, action: PayloadAction<number>) => {
      const { game } = state
      const idx = action.payload
      if (idx < 0 || idx >= DICE_COUNT) return
      if (!game.selection.includes(idx)) {
        game.selection.push(idx)
        game.selectionOrder.push(idx)
      }
    },

    deselectDice: (
      state,
      action: PayloadAction<{ index: number; order: number[] }>
    ) => {
      const { game } = state
      const { index, order } = action.payload
      // restore roll array order if provided; order must be an array of length DICE_COUNT of face values
      if (order && order.length === DICE_COUNT) {
        game.roll.splice(0, game.roll.length, ...order)
      }
      const pos = game.selection.indexOf(index)
      if (pos !== -1) game.selection.splice(pos, 1)
      const orderPos = game.selectionOrder.indexOf(index)
      if (orderPos !== -1) game.selectionOrder.splice(orderPos, 1)

      if (game.selection.length === 0) {
        clearTempSchoolScores(game.school)
        clearTempResults(game.results)
      }
    },

    reorderSelectedDice: (state, action: PayloadAction<number[]>) => {
      const { game } = state
      const ordered = action.payload
      // validate: must contain the same members as current selection
      if (
        ordered.length === game.selection.length &&
        ordered.every((idx) => game.selection.includes(idx))
      ) {
        game.selectionOrder.splice(0, game.selectionOrder.length, ...ordered)
      }
    },

    rollDice: (state) => {
      const { game } = state
      game.saved = false
      // only re-roll non-selected dice positions
      const diceToReroll = game.roll.filter(
        (_, i) => !game.selection.includes(i)
      )
      const newValues = ShScore.rollDice(diceToReroll, game.selection)
      let newIdx = 0
      for (let i = 0; i < DICE_COUNT; i++) {
        if (!game.selection.includes(i)) {
          game.roll[i] = newValues[newIdx++]
        }
      }
      game.rollCount++
      if (game.rollCount >= MAX_ROLLS) game.lock = true
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
  deselectDice,
  reorderSelectedDice
} = shSlice.actions

export default shSlice.reducer
