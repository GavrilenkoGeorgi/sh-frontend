import { configureStore } from '@reduxjs/toolkit'
import { userApi, gameApi } from './api/baseApi'
import authReducer from './slices/authSlice'
import shReducer from './slices/shSlice'
import notificationReducer from './slices/notificationSlice'
import swUpdateReducer from './slices/swUpdateSlice'
import tourReducer from './slices/tourSlice'
import multiplayerReducer from './slices/multiplayerSlice'

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
    sh: shReducer,
    auth: authReducer,
    notification: notificationReducer,
    swUpdate: swUpdateReducer,
    tour: tourReducer,
    multiplayer: multiplayerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, gameApi.middleware),
  devTools: true
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
