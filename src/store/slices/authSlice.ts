import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Nullable, IUser } from '../../types'

interface AuthState {
  user: Nullable<IUser>
  isAuthenticated: boolean
  authInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  authInitialized: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setAuthInitialized: (state) => {
      state.authInitialized = true
    }
  }
})

export const { setCredentials, logout, setAuthInitialized } = authSlice.actions

// selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated
export const selectAuthInitialized = (state: { auth: AuthState }) =>
  state.auth.authInitialized

export default authSlice.reducer
