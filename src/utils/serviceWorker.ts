interface SWConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void
}

export function registerSW(config?: SWConfig): void {
  if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered: ', registration)

          // detect when a new service worker is installed and waiting
          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (installingWorker == null) return

            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // new content is available; notify the app
                config?.onUpdate?.(registration)
              }
            }
          }
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}
