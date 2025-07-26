import { useEffect } from 'react'

interface PWALifecycleCallbacks {
  onAppHidden?: () => void
  onAppVisible?: () => void
  onBeforeUnload?: () => void
}

export const usePWALifecycle = (callbacks: PWALifecycleCallbacks = {}) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        callbacks.onAppHidden?.()
      } else {
        callbacks.onAppVisible?.()
      }
    }

    const handleBeforeUnload = () => {
      callbacks.onBeforeUnload?.()
    }

    const handlePageHide = () => {
      callbacks.onAppHidden?.()
    }

    const handlePageShow = () => {
      callbacks.onAppVisible?.()
    }

    // event listeners for various PWA lifecycle events
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [callbacks])
}
