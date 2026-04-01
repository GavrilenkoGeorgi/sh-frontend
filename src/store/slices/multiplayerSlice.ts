import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  OnlineUser,
  PresenceOnlineUsersPayload
} from '../../features/multiplayer/types'

interface MultiplayerState {
  socketConnected: boolean
  onlineUsers: OnlineUser[]
  selectedInviteId: string | null
  lastError: string | null
}

const initialState: MultiplayerState = {
  socketConnected: false,
  onlineUsers: [],
  selectedInviteId: null,
  lastError: null
}

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
    resetMultiplayerState: () => initialState
  }
})

export const {
  setSocketConnected,
  setSocketDisconnected,
  setOnlineUsers,
  setSelectedInviteId,
  setMultiplayerError,
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

export default multiplayerSlice.reducer
