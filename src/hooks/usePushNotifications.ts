import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  createSubscription,
  getCurrentSubscription,
  isPushSupported
} from '../services/pushNotifications'
import {
  useSubscribePushMutation,
  useUnsubscribePushMutation
} from '../store/api/pushApi'
import { selectIsAuthenticated } from '../store/slices/authSlice'
import { setNotification } from '../store/slices/notificationSlice'
import { ToastTypes } from '../types'

export const usePushNotifications = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [subscribePush] = useSubscribePushMutation()
  const [unsubscribePush] = useUnsubscribePushMutation()

  const supported = isPushSupported()
  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? Notification.permission : 'denied'
  )
  const [isSubscribed, setIsSubscribed] = useState(false)

  // browser subscription state lives outside of react
  useEffect(() => {
    if (!supported) return

    getCurrentSubscription()
      .then((subscription) => setIsSubscribed(subscription !== null))
      .catch(() => undefined)
  }, [supported])

  const enable = useCallback(async (): Promise<void> => {
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result !== 'granted') return

      const subscription =
        (await getCurrentSubscription()) ?? (await createSubscription())
      await subscribePush(subscription.toJSON()).unwrap()
      setIsSubscribed(true)
    } catch {
      dispatch(
        setNotification({
          msg: t('ui.push.enableError'),
          type: ToastTypes.ERROR
        })
      )
    }
  }, [dispatch, subscribePush, t])

  // removes the device from the backend only, keeps the browser subscription
  const detach = useCallback(async (): Promise<void> => {
    if (!supported) return

    try {
      const subscription = await getCurrentSubscription()
      if (subscription) {
        await unsubscribePush({ endpoint: subscription.endpoint }).unwrap()
      }
    } catch {
      // push cleanup must never block the caller
    }
  }, [supported, unsubscribePush])

  const disable = useCallback(async (): Promise<void> => {
    await detach()

    try {
      const subscription = await getCurrentSubscription()
      await subscription?.unsubscribe()
    } finally {
      setIsSubscribed(false)
    }
  }, [detach])

  return { supported, permission, isSubscribed, enable, disable, detach }
}

// silently re-sends the existing subscription after login, never prompts
export const usePushSync = (): void => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [subscribePush] = useSubscribePushMutation()

  useEffect(() => {
    if (
      !isAuthenticated ||
      !isPushSupported() ||
      Notification.permission !== 'granted'
    ) {
      return
    }

    getCurrentSubscription()
      .then((subscription) => {
        if (subscription) subscribePush(subscription.toJSON())
      })
      .catch(() => undefined)
  }, [isAuthenticated, subscribePush])
}
