import { apiSlice } from './apiSlice'
const USERS_URL = process.env.REACT_APP_USERS_URL

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
        method: 'GET'
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
    }),
    sendRecoveryEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgotpwd`,
        method: 'POST',
        body: data
      })
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updatepwd`,
        method: 'PUT',
        body: data
      })
    })
  })
})

export const {
  useSendRecoveryEmailMutation,
  useUpdatePasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useUpdateUserMutation,
  useCheckAuthMutation
} = userApiSlice
