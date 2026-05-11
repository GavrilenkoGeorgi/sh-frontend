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
import { USER_TAGS } from './tags'

type RefreshTokenResponse = {
  user: Pick<User, '_id' | 'name' | 'email'>
}

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
      }),
      invalidatesTags: [USER_TAGS.User]
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ROUTES.LOGOUT,
        credentials: 'include',
        method: 'POST'
      }),
      invalidatesTags: [USER_TAGS.User]
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
      }),
      invalidatesTags: [USER_TAGS.User]
    }),
    refreshToken: builder.query<RefreshTokenResponse, void>({
      query: () => ({
        url: API_ROUTES.REFRESH_TOKEN,
        method: 'POST',
        credentials: 'include'
      }),
      providesTags: [USER_TAGS.User],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data?.user) {
            setAuthSessionHint()
            dispatch(setCredentials({ user: data.user }))
          } else {
            clearAuthSessionHint()
          }
        } catch {
          clearAuthSessionHint()
          // silent failure — user stays unauthenticated
        } finally {
          // startup auth check finished whether refresh succeeded or failed, so the app is not stuck waiting.
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
  })
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
