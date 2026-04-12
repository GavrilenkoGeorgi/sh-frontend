import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi
} from '@reduxjs/toolkit/query/react'

import {
  type FetchBaseQueryMeta,
  type QueryReturnValue
} from '@reduxjs/toolkit/query'
import { type User, ToastTypes } from '../../types'
import {
  clearAuthSessionHint,
  setAuthSessionHint
} from '../../utils/authSessionHint'
import { logout, setCredentials } from './authSlice'
import { setNotification } from './notificationSlice'

interface RefreshResponse {
  user: User
}

// this looks weird but it's a type guard to ensure the refresh response has the expected shape
const isRefreshResponse = (data: unknown): data is RefreshResponse => {
  if (typeof data !== 'object' || data === null || !('user' in data)) {
    return false
  }

  const { user } = data as { user: unknown }

  return (
    typeof user === 'object' &&
    user !== null &&
    '_id' in user &&
    'name' in user &&
    'email' in user &&
    typeof user._id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string'
  )
}

type BaseQueryResult = QueryReturnValue<
  unknown,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>

const baseQuery = fetchBaseQuery({
  baseUrl: '',
  credentials: 'include'
})

let refreshPromise: Promise<BaseQueryResult> | null = null

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // skip reauth for the refresh endpoint itself to avoid infinite loops
  const url = typeof args === 'string' ? args : args.url
  if (
    result.error &&
    result.error.status === 401 &&
    !url.includes('/refresh')
  ) {
    const startedRefresh = !refreshPromise

    if (!refreshPromise) {
      refreshPromise = Promise.resolve(
        baseQuery(
          {
            url: `${process.env.REACT_APP_USERS_URL}/refresh`,
            method: 'POST'
          },
          api,
          extraOptions
        )
      )
    }

    let refreshResult: BaseQueryResult

    try {
      refreshResult = await refreshPromise
    } finally {
      refreshPromise = null
    }

    if (isRefreshResponse(refreshResult.data)) {
      setAuthSessionHint()
      api.dispatch(setCredentials(refreshResult.data))

      result = await baseQuery(args, api, extraOptions)
    } else {
      clearAuthSessionHint()
      api.dispatch(logout())
      api.dispatch(apiSlice.util.resetApiState())
      api.dispatch(gameSlice.util.resetApiState())

      if (startedRefresh) {
        api.dispatch(
          setNotification({
            msg: 'Your session expired. Please log in again.',
            type: ToastTypes.WARNING
          })
        )
      }
    }
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: 'user',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'IncomingInvites', 'OutgoingInvites'],
  endpoints: () => ({})
})

export const gameSlice = createApi({
  reducerPath: 'game',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Game'],
  endpoints: () => ({})
})
