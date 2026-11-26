export const isPushSupported = (): boolean =>
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window

// converts the base64url VAPID public key to the format PushManager expects
export const urlBase64ToUint8Array = (
  base64String: string
): Uint8Array<ArrayBuffer> => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)

  for (let index = 0; index < rawData.length; index++) {
    output[index] = rawData.charCodeAt(index)
  }

  return output
}

export const getCurrentSubscription =
  async (): Promise<PushSubscription | null> => {
    // not "ready": it never resolves when no service worker is registered (localhost)
    const registration = await navigator.serviceWorker.getRegistration()
    return registration?.pushManager.getSubscription() ?? null
  }

export const createSubscription = async (): Promise<PushSubscription> => {
  const registration = await navigator.serviceWorker.ready

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.REACT_APP_VAPID_PUBLIC_KEY ?? ''
    )
  })
}
