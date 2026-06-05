import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '..'

export const listenerMiddleware = createListenerMiddleware()

// strictly typed version of startListening
export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>()
