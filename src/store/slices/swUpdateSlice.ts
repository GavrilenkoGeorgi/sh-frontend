import { createSlice } from '@reduxjs/toolkit'

interface SwUpdateState {
  updateAvailable: boolean
}

const initialState: SwUpdateState = {
  updateAvailable: false
}

const swUpdateSlice = createSlice({
  name: 'swUpdate',
  initialState,
  reducers: {
    setUpdateAvailable: (state, action) => {
      state.updateAvailable = action.payload
    }
  }
})

export const { setUpdateAvailable } = swUpdateSlice.actions

export default swUpdateSlice.reducer
