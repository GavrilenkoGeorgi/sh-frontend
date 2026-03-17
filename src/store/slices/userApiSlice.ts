import { apiSlice } from './apiSlice'
export const USERS_URL = process.env.REACT_APP_USERS_URL

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteAcc: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/delete`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['Auth']
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        credentials: 'include',
        body: data
      }),
      invalidatesTags: ['Auth']
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        credentials: 'include',
        method: 'GET'
      }),
      invalidatesTags: ['Auth']
    }),
    authStatus: builder.query({
      query: () => ({
        url: `${USERS_URL}/status`,
        credentials: 'include',
        method: 'GET'
      }),
      providesTags: ['Auth']
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
        method: 'POST',
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
  }),
  overrideExisting: false
})

export const {
  useDeleteAccMutation,
  useSendRecoveryEmailMutation,
  useUpdatePasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useAuthStatusQuery,
  useSignupMutation,
  useUpdateUserMutation,
  useCheckAuthMutation
} = userApiSlice
