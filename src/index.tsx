import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'

import store from './store'
import router from './routes'
import { registerSW } from './utils/serviceWorker'

import './css/index.css' // fonts?

// eslint-disable-next-line
const container = document.getElementById('app-root')!

const root = createRoot(container)

registerSW()

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
