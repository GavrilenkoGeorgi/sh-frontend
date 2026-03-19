import { configureStore } from '@reduxjs/toolkit'
import { apiSlice, gameSlice } from './slices/apiSlice'
import authReducer from './slices/authSlice'
import shReducer from './slices/shSlice'
import notificationReducer from './slices/notificationSlice'
import swUpdateReducer from './slices/swUpdateSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [gameSlice.reducerPath]: gameSlice.reducer,
    sh: shReducer,
    auth: authReducer,
    notification: notificationReducer,
    swUpdate: swUpdateReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, gameSlice.middleware),
  devTools: true
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
