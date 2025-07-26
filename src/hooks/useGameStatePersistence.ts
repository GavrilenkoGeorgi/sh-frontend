import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'

const GAME_STATE_KEY = 'sharlushka_game_state'

export const useGameStatePersistence = () => {
  const gameState = useSelector((state: RootState) => state.sh.game)

  useEffect(() => {
    if (gameState.rollCount > 0 || gameState.selection.length > 0) {
      const persistableState = {
        selection: gameState.selection,
        roll: gameState.roll,
        rollCount: gameState.rollCount,
        turn: gameState.turn,
        score: gameState.score,
        schoolScore: gameState.schoolScore,
        school: gameState.school,
        combinations: gameState.combinations,
        results: gameState.results
      }
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(persistableState))
    }
  }, [gameState])

  useEffect(() => {
    if (gameState.over || gameState.turn === 1) {
      localStorage.removeItem(GAME_STATE_KEY)
    }
  }, [gameState.over, gameState.turn])

  return {
    getSavedGameState: () => {
      const saved = localStorage.getItem(GAME_STATE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (error) {
          console.error('Failed to parse saved game state:', error)
          return null
        }
      }
      return null
    },
    clearSavedGameState: () => {
      localStorage.removeItem(GAME_STATE_KEY)
    }
  }
}
