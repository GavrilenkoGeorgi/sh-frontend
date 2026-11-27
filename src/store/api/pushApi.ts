import { PUSH_API_ROUTES } from '../../constants/routes'
import { userApi } from './baseApi'

export const { useSubscribePushMutation, useUnsubscribePushMutation } =
  userApi.injectEndpoints({
    endpoints: (builder) => ({
      subscribePush: builder.mutation<void, PushSubscriptionJSON>({
        query: (subscription) => ({
          url: PUSH_API_ROUTES.SUBSCRIBE,
          method: 'POST',
          credentials: 'include',
          body: subscription
        })
      }),
      unsubscribePush: builder.mutation<void, { endpoint: string }>({
        query: (body) => ({
          url: PUSH_API_ROUTES.UNSUBSCRIBE,
          method: 'DELETE',
          credentials: 'include',
          body
        })
      })
    })
  })
