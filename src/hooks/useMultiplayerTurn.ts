import { useState, useCallback, useMemo } from 'react'
import ShScore from '../utils/sh-score'
import type {
  ScoreCategory,
  MultiplayerPlayerState,
  SchoolCategory,
  GameCategory
} from '../features/multiplayer/types'
import type { iCombination } from '../types'

const DICE_COUNT = 5
const MAX_ROLLS = 3

// TODO: cleanup duplicate types if needed
const schoolCategories: SchoolCategory[] = [
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

export const useMultiplayerTurn = (
  playerState: MultiplayerPlayerState | null,
  isMyTurn: boolean
) => {
  const [dice, setDice] = useState<number[]>(emptyDice)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [rollCount, setRollCount] = useState(0)
  const [selectedCategory, setSelectedCategory] =
    useState<ScoreCategory | null>(null)

  const isLocked = rollCount >= MAX_ROLLS

  const usedCategories = useMemo(
    () => new Set(playerState?.usedCategories ?? []),
    [playerState?.usedCategories]
  )

  // compute preview scores based on currently selected dice values
  const previewScores = useMemo<Partial<Record<ScoreCategory, number>>>(() => {
    if (rollCount === 0 || !isMyTurn) return {}

    const selectedValues = selectedIndices.map((i) => dice[i])
    if (selectedValues.length === 0) return {}

    const scores: Partial<Record<ScoreCategory, number>> = {}

    // school scores
    const schoolScores = ShScore.getSchoolScore(selectedValues)
    schoolCategories.forEach((category, index) => {
      if (!usedCategories.has(category) && schoolScores[index] !== null) {
        scores[category] = schoolScores[index] as number
      }
    })

    // game combination scores
    const sorted = ShScore.sort(selectedValues)
    const combinationScores: iCombination = ShScore.getScore(sorted)
    gameCategories.forEach((category) => {
      if (!usedCategories.has(category)) {
        scores[category] = combinationScores[category as keyof iCombination]
      }
    })

    return scores
  }, [dice, selectedIndices, rollCount, isMyTurn, usedCategories])

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
      if (usedCategories.has(category)) return
      setSelectedCategory(category)
    },
    [isMyTurn, rollCount, usedCategories]
  )

  const resetTurn = useCallback(() => {
    setDice(emptyDice())
    setSelectedIndices([])
    setRollCount(0)
    setSelectedCategory(null)
  }, [])

  return {
    dice,
    selectedIndices,
    rollCount,
    selectedCategory,
    previewScores,
    isLocked,
    roll,
    selectDie,
    deselectDie,
    selectCategory,
    resetTurn
  }
}
