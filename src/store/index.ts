import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { apiSlice } from './slices/apiSlice'
import shReducer from './slices/shSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    sh: shReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
