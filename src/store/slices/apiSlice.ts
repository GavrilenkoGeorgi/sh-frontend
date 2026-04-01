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

    const refreshResult = await refreshPromise!
    refreshPromise = null

    if (refreshResult.data) {
      api.dispatch({
        type: 'auth/setCredentials',
        payload: refreshResult.data
      })

      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch({ type: 'auth/logout' })
      api.dispatch(apiSlice.util.resetApiState())
      api.dispatch(gameSlice.util.resetApiState())
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
