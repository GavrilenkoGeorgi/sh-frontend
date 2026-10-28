type SWConfig = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: unknown) => void
}

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '[::1]'

let waitingRegistration: ServiceWorkerRegistration | null = null

// logs SW lifecycle events in non-production builds only
const devLog = (...args: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') console.log(...args)
}

// sends SKIP_WAITING to the waiting SW so it activates
export function applyServiceWorkerUpdate(): void {
  const waiting = waitingRegistration?.waiting
  if (!waiting) return
  waiting.postMessage({ type: 'SKIP_WAITING' })
}

export function registerSW(config?: SWConfig): void {
  if (!('serviceWorker' in navigator) || isLocalhost) return

  // reload once when a new SW takes control
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })

  window.addEventListener('load', async () => {
    try {
      const registration =
        await navigator.serviceWorker.register('/service-worker.js')

      devLog('[SW] registered:', registration)

      config?.onSuccess?.(registration)

      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (!installingWorker) return

        installingWorker.onstatechange = () => {
          devLog('[SW] state:', installingWorker.state)

          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // new SW installed, but old SW still controls the page
              devLog('[SW] update available')
              waitingRegistration = registration
              config?.onUpdate?.(registration)
            } else {
              // first install
              devLog('[SW] content cached for offline use')
            }
          }
        }
      }

      // Optional: useful in dev/local to force-check for updates
      if (isLocalhost) {
        registration.update().catch((err) => {
          console.warn('[SW] manual update check failed:', err)
        })
      }
    } catch (error) {
      console.error('[SW] registration failed:', error)
      config?.onError?.(error)
    }
  })
}
