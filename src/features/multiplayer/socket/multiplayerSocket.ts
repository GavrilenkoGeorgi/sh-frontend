import { io, type Socket } from 'socket.io-client'

const resolveSocketUrl = (): string => {
  // optional oveerride via env variable
  // defalutls to same origin as frontend
  const socketUrl = process.env.REACT_APP_SOCKET_URL
  if (socketUrl !== undefined && socketUrl.trim() !== '') {
    return socketUrl
  }

  const usersApiUrl = process.env.REACT_APP_USERS_URL
  if (usersApiUrl !== undefined && usersApiUrl.trim() !== '') {
    try {
      return new URL(usersApiUrl, window.location.origin).origin
    } catch {
      return window.location.origin
    }
  }

  return window.location.origin
}

export const multiplayerSocket: Socket = io(resolveSocketUrl(), {
  autoConnect: false,
  withCredentials: true
})

export const connectMultiplayerSocket = () => {
  if (!multiplayerSocket.active) {
    multiplayerSocket.connect()
  }
}

export const disconnectMultiplayerSocket = () => {
  if (multiplayerSocket.active) {
    multiplayerSocket.disconnect()
  }
}

export const emitInviteSend = (toUserId: string) => {
  multiplayerSocket.emit('invite:send', { toUserId })
}

export const emitInviteAccept = (inviteId: string) => {
  multiplayerSocket.emit('invite:accept', { inviteId })
}

export const emitInviteDecline = (inviteId: string) => {
  multiplayerSocket.emit('invite:decline', { inviteId })
}

export const emitSubmitTurn = (
  gameId: string,
  move: { category: string; score: number; dice: number[] }
) => {
  multiplayerSocket.emit('game:submit-turn', { gameId, move })
}

export const emitSchoolFailed = (gameId: string) => {
  multiplayerSocket.emit('game:school-failed', { gameId })
}
