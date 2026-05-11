import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'
import {
  type FetchBaseQueryMeta,
  type QueryReturnValue
} from '@reduxjs/toolkit/query'

import { API_ROUTES } from '../../constants/routes'
import { type User, ToastTypes } from '../../types'
import {
  clearAuthSessionHint,
  setAuthSessionHint
} from '../../utils/authSessionHint'
import { logout as clearAuthState, setCredentials } from './authSlice'
import { setNotification } from './notificationSlice'
import { GAME_TAGS, USER_TAGS } from './tags'

interface RefreshResponse {
  user: User
}

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
    typeof (user as { _id?: unknown })._id === 'string' &&
    typeof (user as { name?: unknown }).name === 'string' &&
    typeof (user as { email?: unknown }).email === 'string'
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

const isExactRoute = (url: string, route: string) => url === route

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  const url = typeof args === 'string' ? args : args.url
  const isRefreshRequest = isExactRoute(url, API_ROUTES.REFRESH_TOKEN)
  const isLogoutRequest = isExactRoute(url, API_ROUTES.LOGOUT)

  if (
    result.error &&
    result.error.status === 401 &&
    !isRefreshRequest &&
    !isLogoutRequest
  ) {
    const startedRefresh = refreshPromise === null

    if (!refreshPromise) {
      refreshPromise = Promise.resolve(
        baseQuery(
          {
            url: API_ROUTES.REFRESH_TOKEN,
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
      api.dispatch(setCredentials({ user: refreshResult.data.user }))
      result = await baseQuery(args, api, extraOptions)
    } else {
      clearAuthSessionHint()
      api.dispatch(clearAuthState())
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
  tagTypes: Object.values(USER_TAGS),
  endpoints: () => ({})
})

export const gameSlice = createApi({
  reducerPath: 'game',
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(GAME_TAGS),
  endpoints: () => ({})
})
