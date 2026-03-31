export interface OnlineUser {
  userId: string
  username: string
}

export interface PresenceOnlineUsersPayload {
  users: OnlineUser[]
}
