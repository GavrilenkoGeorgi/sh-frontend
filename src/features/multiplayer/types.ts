export interface OnlineUser {
  userId: string
  username: string
}

export interface BasicUser {
  id: string
  username: string
}

export interface PresenceOnlineUsersPayload {
  users: OnlineUser[]
}

export interface InviteSendPayload {
  toUserId: string
}

export interface InviteReceivedPayload {
  inviteId: string
  fromUser: BasicUser
}

export interface InviteStatusPayload {
  inviteId: string
  status: 'accepted' | 'declined' | 'cancelled' | 'expired'
}

export interface IncomingInvite {
  inviteId: string
  fromUser: BasicUser
}

export interface OutgoingInvite {
  inviteId: string
  toUser: BasicUser
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'expired'
}
