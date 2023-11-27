import { createSlice } from '@reduxjs/toolkit'
import type { iNotification } from '../../types'

const initialState: iNotification = {
  message: null,
  type: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      if (action.payload.msg != null) {
        state.message = action.payload.msg
        state.type = action.payload.type
      } else {
        state.message = null
      }
    }
  }
})

export const { setNotification } = notificationSlice.actions

export default notificationSlice.reducer
