import { INVITE_API_ROUTES } from '../../constants/routes'
import type {
  IncomingInvite,
  OutgoingInvite
} from '../../features/multiplayer/types'
import { apiSlice } from './apiSlice'
import { USER_TAGS } from './tags'

interface IncomingInvitesResponse {
  invites: IncomingInvite[]
}

interface OutgoingInvitesResponse {
  invites: OutgoingInvite[]
}

export const inviteApiSlice = apiSlice.injectEndpoints({
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
    })
  })
})

export const { useGetIncomingInvitesQuery, useGetOutgoingInvitesQuery } =
  inviteApiSlice
