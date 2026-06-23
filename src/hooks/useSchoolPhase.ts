import { useMemo } from 'react'
import { MultiplayerPlayerState } from '../features/multiplayer/types'
import { schoolCategories } from './useMultiplayerTurn'

export function useSchoolPhase(playerState: MultiplayerPlayerState | null) {
  if (!playerState) {
    return { isInSchoolPhase: false, usedCategories: new Set() }
  }

  const usedCategories = useMemo(
    () => new Set(playerState?.usedCategories ?? []),
    [playerState?.usedCategories]
  )

  const isInSchoolPhase = useMemo(() => {
    const usedSchoolCount = schoolCategories.filter((category) =>
      usedCategories.has(category)
    ).length

    return usedSchoolCount < 6
  }, [usedCategories, schoolCategories])

  return { usedCategories, isInSchoolPhase }
}
