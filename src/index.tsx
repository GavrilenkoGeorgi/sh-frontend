import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import store from './store'
import router from './routes'

import App from './App'
import './css/index.css' // fonts?

// eslint-disable-next-line
const container = document.getElementById('app-root')!

const root = createRoot(container)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <App />
  </Provider>
)
