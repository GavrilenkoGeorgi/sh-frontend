type SWConfig = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: unknown) => void
}

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '[::1]'

const UPDATE_RELOAD_FLAG = 'sh-sw-update-reload'

let waitingRegistration: ServiceWorkerRegistration | null = null

function setManualScrollRestoration(): void {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}

function forceScrollToTop(): void {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function prepareForUpdateReload(): void {
  try {
    window.sessionStorage.setItem(UPDATE_RELOAD_FLAG, '1')
  } catch {
    // sessionStorage may be unavailable in private/restricted contexts.
  }

  setManualScrollRestoration()
  forceScrollToTop()
}

function resetScrollAfterUpdateReload(): void {
  let shouldReset = false

  try {
    shouldReset = window.sessionStorage.getItem(UPDATE_RELOAD_FLAG) === '1'
    if (shouldReset) {
      window.sessionStorage.removeItem(UPDATE_RELOAD_FLAG)
    }
  } catch {
    shouldReset = false
  }

  if (!shouldReset) return

  setManualScrollRestoration()
  forceScrollToTop()
  window.requestAnimationFrame(forceScrollToTop)
  window.setTimeout(forceScrollToTop, 0)
  window.setTimeout(forceScrollToTop, 250)
}

// sends SKIP_WAITING to the waiting SW so it activates
export function applyServiceWorkerUpdate(): boolean {
  const waiting = waitingRegistration?.waiting
  if (!waiting) return false

  prepareForUpdateReload()
  waiting.postMessage({ type: 'SKIP_WAITING' })
  return true
}

// TODO: cleanup debug logs
export function registerSW(config?: SWConfig): void {
  resetScrollAfterUpdateReload()

  if (!('serviceWorker' in navigator) || isLocalhost) return

  // reload once when a new SW takes control
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    prepareForUpdateReload()
    window.location.reload()
  })

  window.addEventListener('load', async () => {
    try {
      const registration =
        await navigator.serviceWorker.register('/service-worker.js')

      console.log('[SW] registered:', registration)

      config?.onSuccess?.(registration)

      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (!installingWorker) return

        installingWorker.onstatechange = () => {
          console.log('[SW] state:', installingWorker.state)

          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // new SW installed, but old SW still controls the page
              console.log('[SW] update available')
              waitingRegistration = registration
              config?.onUpdate?.(registration)
            } else {
              // first install
              console.log('[SW] content cached for offline use')
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
