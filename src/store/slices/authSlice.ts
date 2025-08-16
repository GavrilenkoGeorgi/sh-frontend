import { createSlice } from '@reduxjs/toolkit'
import type { Nullable, IUser } from '../../types'

const checkUserInfo = (): Nullable<IUser> => {
  const data = localStorage.getItem('userInfo')
  const info = Boolean(data)

  if (info) return JSON.parse(data ?? '{}')
  else return null
}

const initialState = {
  userInfo: checkUserInfo(),
  isCheckingAuth: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startCheckingAuth: (state) => {
      state.isCheckingAuth = true
    },
    finishCheckingAuth: (state) => {
      state.isCheckingAuth = false
    },
    setCredentials: (state, action) => {
      state.userInfo = action.payload.user
      localStorage.setItem(
        'accessToken',
        JSON.stringify(action.payload.accessToken)
      )
    },
    logout: (state) => {
      state.userInfo = null
      localStorage.removeItem('accessToken')
    }
  }
})

export const { setCredentials, logout, startCheckingAuth, finishCheckingAuth } =
  authSlice.actions

export default authSlice.reducer
