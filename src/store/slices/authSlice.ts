import { createSlice } from '@reduxjs/toolkit'
import type { Nullable, IUser } from '../../types'

const checkUserInfo = (): Nullable<IUser> => {

  const data = localStorage.getItem('userInfo')
  const info = Boolean(data)

  if (info) return JSON.parse(data ?? '{}')
  else return null
}

const initialState = {
  userInfo: checkUserInfo()
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },
    logout: (state, action) => {
      state.userInfo = null
      localStorage.removeItem('userInfo')
    }
  }
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
