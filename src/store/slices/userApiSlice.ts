import { API_ROUTES } from '../../constants/routes'
import { LoginFormSchemaType } from '../../schemas/LoginFormSchema'
import { ProfileFormSchemaType } from '../../schemas/ProfileFormSchema'
import { PwdUpdateFormSchemaType } from '../../schemas/PwdUpdateSchema'
import { RecoveryEmailSchemaType } from '../../schemas/RecoveryEmailSchema'
import { RegisterFormSchemaType } from '../../schemas/RegisterFormSchema'
import { User } from '../../types'
import { apiSlice } from './apiSlice'
import { setCredentials, setAuthInitialized } from './authSlice'
import {
  clearAuthSessionHint,
  setAuthSessionHint
} from '../../utils/authSessionHint'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteAcc: builder.mutation<void, void>({
      query: () => ({
        url: API_ROUTES.DELETE_ACC,
        method: 'DELETE',
        credentials: 'include'
      })
    }),
    login: builder.mutation<User, LoginFormSchemaType>({
      query: (data) => ({
        url: API_ROUTES.LOGIN,
        method: 'POST',
        credentials: 'include',
        body: data
      })
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ROUTES.LOGOUT,
        credentials: 'include',
        method: 'POST'
      })
    }),
    signup: builder.mutation<void, RegisterFormSchemaType>({
      query: (data) => ({
        url: API_ROUTES.SIGNUP,
        method: 'POST',
        body: data
      })
    }),
    updateProfile: builder.mutation<void, ProfileFormSchemaType>({
      query: (data) => ({
        url: API_ROUTES.UPDATE_PROFILE,
        method: 'POST',
        credentials: 'include',
        body: data
      })
    }),
    refreshToken: builder.query<unknown, void>({
      query: () => ({
        url: API_ROUTES.REFRESH_TOKEN,
        method: 'POST',
        credentials: 'include'
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const response = data as {
            user?: { _id: string; name: string; email: string }
          }
          if (response?.user) {
            setAuthSessionHint()
            dispatch(setCredentials({ user: response.user }))
          } else {
            clearAuthSessionHint()
          }
        } catch {
          clearAuthSessionHint()
          // silent failure — user stays unauthenticated
        } finally {
          dispatch(setAuthInitialized())
        }
      }
    }),
    sendRecoveryEmail: builder.mutation<void, RecoveryEmailSchemaType>({
      query: (data) => ({
        url: API_ROUTES.SEND_RECOVERY_EMAIL,
        method: 'POST',
        body: data
      })
    }),
    updatePassword: builder.mutation<void, PwdUpdateFormSchemaType>({
      query: (data) => ({
        url: API_ROUTES.UPDATE_PASSWORD,
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
  useSignupMutation,
  useUpdateProfileMutation,
  useRefreshTokenQuery
} = userApiSlice
