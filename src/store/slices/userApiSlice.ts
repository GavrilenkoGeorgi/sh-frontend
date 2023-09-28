import { apiSlice } from './apiSlice'
const USERS_URL = 'http://localhost:5000/api/users'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        credentials: 'include',
        body: data
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        credentials: 'include',
        method: 'POST'
      })
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data
      })
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        credentials: 'include',
        body: data
      })
    }),
    checkAuth: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/refresh`,
        method: 'POST',
        credentials: 'include',
        body: data
      })
    })
  })
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useUpdateUserMutation,
  useCheckAuthMutation
} = userApiSlice
