import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  BasicUser,
  GameEndedPayload,
  MultiplayerGameState,
  MultiplayerPlayerState,
  OnlineUser,
  PresenceOnlineUsersPayload
} from '../../features/multiplayer/types'
import { GameCombinations } from '../../types'

interface MultiplayerState {
  socketConnected: boolean
  onlineUsers: OnlineUser[]
  selectedInviteId: string | null
  lastError: string | null
  activeGame: MultiplayerGameState | null
  opponent: BasicUser | null
  gameEndResult: GameEndedPayload | null
}

const initialState: MultiplayerState = {
  socketConnected: false,
  onlineUsers: [],
  selectedInviteId: null,
  lastError: null,
  activeGame: null,
  opponent: null,
  gameEndResult: null
}

// the server sends null for game categories without saves, the UI expects empty arrays
// TODO: (SH-34) the cleaner long-term fix is for the backend to initialise those categories as [].
const normalizeGameState = (
  gameState: MultiplayerGameState
): MultiplayerGameState => ({
  ...gameState,
  players: Object.fromEntries(
    Object.entries(gameState.players).map(
      ([playerId, player]): [string, MultiplayerPlayerState] => {
        const scoreCard = { ...player.scoreCard }
        Object.values(GameCombinations).forEach((category) => {
          scoreCard[category] = player.scoreCard[category] ?? []
        })
        return [playerId, { ...player, scoreCard }]
      }
    )
  )
})

const multiplayerSlice = createSlice({
  name: 'multiplayer',
  initialState,
  reducers: {
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload
    },
    setSocketDisconnected: (state) => {
      state.socketConnected = false
      state.onlineUsers = []
    },
    setOnlineUsers: (
      state,
      action: PayloadAction<PresenceOnlineUsersPayload['users']>
    ) => {
      state.onlineUsers = action.payload
    },
    setSelectedInviteId: (state, action: PayloadAction<string | null>) => {
      state.selectedInviteId = action.payload
    },
    setMultiplayerError: (state, action: PayloadAction<string | null>) => {
      state.lastError = action.payload
    },
    setActiveGame: (
      state,
      action: PayloadAction<{
        gameState: MultiplayerGameState
        opponent: BasicUser
      }>
    ) => {
      state.activeGame = normalizeGameState(action.payload.gameState)
      state.opponent = action.payload.opponent
    },
    updateGameState: (state, action: PayloadAction<MultiplayerGameState>) => {
      state.activeGame = normalizeGameState(action.payload)
    },
    setGameEnded: (state, action: PayloadAction<GameEndedPayload>) => {
      state.gameEndResult = action.payload
    },
    clearGameEnd: (state) => {
      state.gameEndResult = null
      state.activeGame = null
      state.opponent = null
    },
    clearActiveGame: (state) => {
      state.activeGame = null
      state.opponent = null
    },
    resetMultiplayerState: () => initialState
  }
})

export const {
  setSocketConnected,
  setSocketDisconnected,
  setOnlineUsers,
  setSelectedInviteId,
  setMultiplayerError,
  setActiveGame,
  updateGameState,
  setGameEnded,
  clearGameEnd,
  clearActiveGame,
  resetMultiplayerState
} = multiplayerSlice.actions

// selectors
export const selectSocketConnected = (state: {
  multiplayer: MultiplayerState
}) => state.multiplayer.socketConnected
export const selectOnlineUsers = (state: { multiplayer: MultiplayerState }) =>
  state.multiplayer.onlineUsers
export const selectSelectedInviteId = (state: {
  multiplayer: MultiplayerState
}) => state.multiplayer.selectedInviteId
export const selectMultiplayerError = (state: {
  multiplayer: MultiplayerState
}) => state.multiplayer.lastError
export const selectActiveGame = (state: { multiplayer: MultiplayerState }) =>
  state.multiplayer.activeGame
export const selectOpponent = (state: { multiplayer: MultiplayerState }) =>
  state.multiplayer.opponent
export const selectGameEndResult = (state: { multiplayer: MultiplayerState }) =>
  state.multiplayer.gameEndResult

export default multiplayerSlice.reducer
