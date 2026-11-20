import { createSlice } from '@reduxjs/toolkit'

interface SwUpdateState {
  updateAvailable: boolean
  // count of mounted full-page loading indicators (e.g. Fallback)
  activeLoaders: number
}

const initialState: SwUpdateState = {
  updateAvailable: false,
  activeLoaders: 0
}

const swUpdateSlice = createSlice({
  name: 'swUpdate',
  initialState,
  reducers: {
    setUpdateAvailable: (state, action) => {
      state.updateAvailable = action.payload
    },
    loaderMounted: (state) => {
      state.activeLoaders += 1
    },
    loaderUnmounted: (state) => {
      state.activeLoaders = Math.max(0, state.activeLoaders - 1)
    }
  }
})

export const { setUpdateAvailable, loaderMounted, loaderUnmounted } =
  swUpdateSlice.actions

// selectors
export const selectIsAppLoading = (state: { swUpdate: SwUpdateState }) =>
  state.swUpdate.activeLoaders > 0

export default swUpdateSlice.reducer
