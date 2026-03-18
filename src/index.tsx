import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'

import store from './store'
import router from './routes'
import { registerSW } from './utils/serviceWorker'
import { setNotification } from './store/slices/notificationSlice'
import { ToastTypes } from './types'

import './css/index.css' // fonts?

// eslint-disable-next-line
const container = document.getElementById('app-root')!

const root = createRoot(container)

registerSW({
  onUpdate: () => {
    store.dispatch(
      setNotification({
        msg: 'A new version is available — reload to update.',
        type: ToastTypes.SUCCESS
      })
    )
  }
})

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
