import { useMemo } from 'react'
import type {
  MultiplayerPlayerState,
  ScoreCategory
} from '../features/multiplayer/types'
import { SchoolCombinations } from '../types'

export const schoolCategories = Object.values(SchoolCombinations)

export function useSchoolPhase(playerState: MultiplayerPlayerState | null) {
  const usedCategories = useMemo(
    () => new Set<ScoreCategory>(playerState?.usedCategories ?? []),
    [playerState?.usedCategories]
  )

  const usedSchoolCount = schoolCategories.filter((category) =>
    usedCategories.has(category)
  ).length
  const isInSchoolPhase =
    playerState !== null && usedSchoolCount < schoolCategories.length

  return { usedCategories, isInSchoolPhase }
}
