import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'

import store from './store'
import router from './routes'
import { registerSW } from './utils/serviceWorker'
import { setUpdateAvailable } from './store/slices/swUpdateSlice'
import './i18n'

import './css/index.css' // fonts?

const container = document.getElementById('app-root')!

const root = createRoot(container)

registerSW({
  onUpdate: () => {
    store.dispatch(setUpdateAvailable(true))
  }
})

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
