import { useState, useCallback, useMemo } from 'react'
import ShScore from '../utils/sh-score'
import {
  emitSubmitTurn,
  emitSchoolFailed
} from '../features/multiplayer/socket/multiplayerSocket'
import type {
  ScoreCategory,
  MultiplayerPlayerState,
  SchoolCategory,
  GameCategory
} from '../features/multiplayer/types'
import type { Combination } from '../types'
import { useSchoolPhase } from './useSchoolPhase'

const DICE_COUNT = 5
const MAX_ROLLS = 3
export const MAX_SAVES_PER_COMBINATION = 3

// TODO: cleanup duplicate types if needed
export const schoolCategories: SchoolCategory[] = [
  'ones',
  'twos',
  'threes',
  'fours',
  'fives',
  'sixes'
]

const gameCategories: GameCategory[] = [
  'pair',
  'twoPairs',
  'triple',
  'full',
  'quads',
  'poker',
  'small',
  'large',
  'chance'
]

export interface MultiplayerTurnState {
  dice: number[]
  selectedIndices: number[]
  rollCount: number
  selectedCategory: ScoreCategory | null
  previewScores: Partial<Record<ScoreCategory, number>>
  isLocked: boolean
}

const emptyDice = (): number[] => Array(DICE_COUNT).fill(0)

const shScore = new ShScore()

export const useMultiplayerTurn = (
  playerState: MultiplayerPlayerState | null,
  isMyTurn: boolean,
  gameId: string | null = null
) => {
  const [dice, setDice] = useState<number[]>(emptyDice)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [rollCount, setRollCount] = useState(0)
  const [selectedCategory, setSelectedCategory] =
    useState<ScoreCategory | null>(null)

  const isLocked = rollCount >= MAX_ROLLS

  const { isInSchoolPhase, usedCategories } = useSchoolPhase(playerState)

  const isGameCategoryAvailable = useCallback(
    (category: GameCategory) =>
      (playerState?.scoreCard[category]?.length ?? 0) <
      MAX_SAVES_PER_COMBINATION,
    [playerState?.scoreCard]
  )

  // compute preview scores based on currently selected dice values
  // during school phase only school categories are shown, afterwards only game categories
  const previewScores = useMemo<Partial<Record<ScoreCategory, number>>>(() => {
    if (rollCount === 0 || !isMyTurn) return {}

    const selectedValues = selectedIndices.map((i) => dice[i])
    if (selectedValues.length === 0) return {}

    const scores: Partial<Record<ScoreCategory, number>> = {}

    if (isInSchoolPhase) {
      // school phase: only school scores
      const schoolScores = shScore.getSchoolScore(selectedValues)
      schoolCategories.forEach((category, index) => {
        if (!usedCategories.has(category) && schoolScores[index] !== null) {
          scores[category] = schoolScores[index] as number
        }
      })
    } else {
      // game phase: only game combination scores
      const sorted = shScore.sort(selectedValues)
      const combinationScores: Combination = shScore.getScore(sorted)
      gameCategories.forEach((category) => {
        if (isGameCategoryAvailable(category)) {
          scores[category] = combinationScores[category as keyof Combination]
        }
      })
    }

    return scores
  }, [
    dice,
    selectedIndices,
    rollCount,
    isMyTurn,
    usedCategories,
    isInSchoolPhase,
    isGameCategoryAvailable
  ])

  // check whether any remaining school category can be scored from ALL rolled dice
  const canScoreFromAllDice = useMemo(() => {
    if (!isInSchoolPhase || rollCount === 0) return false
    const schoolScores = shScore.getSchoolScore(dice)
    return schoolCategories.some(
      (category, index) =>
        !usedCategories.has(category) && schoolScores[index] !== null
    )
  }, [isInSchoolPhase, rollCount, dice, usedCategories])

  // true when locked, school phase, and no die in the roll can score any remaining school category
  const schoolFailed =
    isLocked && isInSchoolPhase && rollCount > 0 && !canScoreFromAllDice

  // true when locked, school phase, but the roll does contain scoreable dice — user hasn't selected them yet
  const hasUnselectedScoringDice =
    isLocked && isInSchoolPhase && canScoreFromAllDice

  const roll = useCallback(() => {
    if (!isMyTurn || rollCount >= MAX_ROLLS) return

    setDice((prev) => {
      const next = [...prev]
      for (let i = 0; i < DICE_COUNT; i++) {
        if (!selectedIndices.includes(i)) {
          next[i] = Math.floor(Math.random() * 6) + 1
        }
      }
      return next
    })
    setRollCount((count) => count + 1)
    setSelectedCategory(null)
  }, [isMyTurn, rollCount, selectedIndices])

  const selectDie = useCallback(
    (index: number) => {
      if (!isMyTurn || rollCount === 0 || index < 0 || index >= DICE_COUNT) {
        return
      }
      setSelectedIndices((prev) =>
        prev.includes(index) ? prev : [...prev, index]
      )
    },
    [isMyTurn, rollCount]
  )

  const deselectDie = useCallback(
    (index: number) => {
      if (!isMyTurn) return
      setSelectedIndices((prev) => prev.filter((i) => i !== index))
    },
    [isMyTurn]
  )

  const selectCategory = useCallback(
    (category: ScoreCategory) => {
      if (!isMyTurn || rollCount === 0) return
      const isSchool = schoolCategories.includes(category as SchoolCategory)
      const isCategoryLocked = isSchool
        ? usedCategories.has(category)
        : isInSchoolPhase || !isGameCategoryAvailable(category as GameCategory)
      if (isCategoryLocked) return
      setSelectedCategory(category)
    },
    [
      isMyTurn,
      rollCount,
      usedCategories,
      isGameCategoryAvailable,
      isInSchoolPhase
    ]
  )

  const resetTurn = useCallback(() => {
    setDice(emptyDice())
    setSelectedIndices([])
    setRollCount(0)
    setSelectedCategory(null)
  }, [])

  const canSubmit = isMyTurn && rollCount > 0 && selectedCategory !== null

  const submitTurn = useCallback(() => {
    if (!gameId || !selectedCategory || rollCount === 0 || !isMyTurn) return

    const rawScore = previewScores[selectedCategory]
    // in game phase only, allow saving zero when no combination matches
    const score =
      rawScore !== undefined
        ? rawScore
        : !isInSchoolPhase &&
            gameCategories.includes(selectedCategory as GameCategory)
          ? 0
          : undefined
    if (score === undefined) return

    // dice payload: face values of selected dice (1..5 values, each 1..6)
    const selectedDiceValues = selectedIndices.map((i) => dice[i])
    // if nothing selected, send all dice
    const dicePayload =
      selectedDiceValues.length > 0 ? selectedDiceValues : [...dice]

    emitSubmitTurn(gameId, {
      category: selectedCategory,
      score,
      dice: dicePayload
    })

    resetTurn()
  }, [
    gameId,
    selectedCategory,
    rollCount,
    isMyTurn,
    isInSchoolPhase,
    previewScores,
    selectedIndices,
    dice,
    resetTurn
  ])

  const failSchool = useCallback(() => {
    if (!gameId) return
    emitSchoolFailed(gameId)
    resetTurn()
  }, [gameId, resetTurn])

  return {
    dice,
    selectedIndices,
    rollCount,
    selectedCategory,
    previewScores,
    isLocked,
    isInSchoolPhase,
    schoolFailed,
    hasUnselectedScoringDice,
    canSubmit,
    roll,
    selectDie,
    deselectDie,
    selectCategory,
    submitTurn,
    failSchool,
    resetTurn
  }
}
