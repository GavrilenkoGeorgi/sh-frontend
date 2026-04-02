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

// multiplayer game types

export type MultiplayerGameStatus = 'active' | 'finished' | 'abandoned'

export type GameEndReason = 'completed' | 'opponent_disconnected'

export type SchoolCategory =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'

export type GameCategory =
  | 'pair'
  | 'twoPairs'
  | 'triple'
  | 'full'
  | 'quads'
  | 'poker'
  | 'small'
  | 'large'
  | 'chance'

export type ScoreCategory = SchoolCategory | GameCategory

export interface MultiplayerPlayerState {
  totalScore: number
  usedCategories: ScoreCategory[]
  scoreCard: Record<ScoreCategory, number | null>
}

export interface MultiplayerGameState {
  gameId: string
  status: MultiplayerGameStatus
  player1Id: string
  player2Id: string
  currentTurnPlayerId: string
  turnNumber: number
  players: Record<string, MultiplayerPlayerState>
  winnerId?: string | null
  endedReason?: 'completed' | 'disconnect'
}

export interface GameStartedPayload {
  gameId: string
  currentTurnPlayerId: string
  opponent: BasicUser
  gameState: MultiplayerGameState
}

export interface GameStateUpdatedPayload {
  gameId: string
  gameState: MultiplayerGameState
}

export interface GameEndedPayload {
  gameId: string
  reason: GameEndReason
  winnerId?: string | null
  gameState?: MultiplayerGameState
}
