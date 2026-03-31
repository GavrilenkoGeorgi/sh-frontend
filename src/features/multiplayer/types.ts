export interface OnlineUser {
  userId: string
  username: string
}

export interface PresenceOnlineUsersPayload {
  users: OnlineUser[]
}

export interface InviteSendPayload {
  toUserId: string
}
