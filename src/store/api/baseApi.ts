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
import { getErrMsg } from '../../utils'
import { logout as clearAuthState, setCredentials } from '../slices/authSlice'
import { setNotification } from '../slices/notificationSlice'
import { GAME_TAGS, USER_TAGS } from './tags'

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

    if (!refreshResult.error) {
      setAuthSessionHint()
      api.dispatch(
        setCredentials({ user: (refreshResult.data as { user: User }).user })
      )
      result = await baseQuery(args, api, extraOptions)
    } else {
      clearAuthSessionHint()
      api.dispatch(clearAuthState())
      api.dispatch(userApi.util.resetApiState())
      api.dispatch(gameApi.util.resetApiState())

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

  if (result.error && result.error.status !== 401) {
    const errMsg = getErrMsg(result.error)
    if (errMsg) {
      api.dispatch(setNotification({ msg: errMsg, type: ToastTypes.ERROR }))
    }
  }

  return result
}

export const userApi = createApi({
  reducerPath: 'user',
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(USER_TAGS),
  endpoints: () => ({})
})

export const gameApi = createApi({
  reducerPath: 'game',
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(GAME_TAGS),
  endpoints: () => ({})
})
