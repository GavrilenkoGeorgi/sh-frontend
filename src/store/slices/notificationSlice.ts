import { createSlice } from '@reduxjs/toolkit'
import type { Notification } from '../../types'

const initialState: Notification = {
  message: null,
  type: null,
  busy: false,
  autoClose: true
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      const { msg, type, busy, autoClose } = action.payload

      state.message = msg ?? null
      state.type = type ?? null

      if (busy !== undefined) {
        state.busy = busy
      }

      // when showing a toast, default autoClose to true unless explicitly false
      if (msg != null) {
        state.autoClose = autoClose ?? true
      } else {
        // reset when clearing
        state.autoClose = true
      }
    },
    setBusy: (state, action) => {
      state.busy = action.payload
    }
  }
})

export const { setNotification, setBusy } = notificationSlice.actions

export default notificationSlice.reducer
