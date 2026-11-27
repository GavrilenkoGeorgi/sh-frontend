import { INVITE_API_ROUTES } from '../../constants/routes'
import type {
  IncomingInvite,
  InvitableUser,
  OutgoingInvite
} from '../../features/multiplayer/types'
import { userApi } from './baseApi'
import { USER_TAGS } from './tags'

interface IncomingInvitesResponse {
  invites: IncomingInvite[]
}

interface OutgoingInvitesResponse {
  invites: OutgoingInvite[]
}

interface InvitableUsersResponse {
  users: InvitableUser[]
}

export const {
  useGetIncomingInvitesQuery,
  useGetOutgoingInvitesQuery,
  useGetInvitableUsersQuery
} = userApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncomingInvites: builder.query<IncomingInvitesResponse, void>({
      query: () => ({
        url: INVITE_API_ROUTES.INCOMING,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: [USER_TAGS.IncomingInvites]
    }),
    getOutgoingInvites: builder.query<OutgoingInvitesResponse, void>({
      query: () => ({
        url: INVITE_API_ROUTES.OUTGOING,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: [USER_TAGS.OutgoingInvites]
    }),
    getInvitableUsers: builder.query<InvitableUsersResponse, void>({
      query: () => ({
        url: INVITE_API_ROUTES.INVITABLE_USERS,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: [USER_TAGS.InvitableUsers]
    })
  })
})
