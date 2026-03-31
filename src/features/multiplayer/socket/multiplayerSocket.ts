import { io, type Socket } from 'socket.io-client'

const resolveSocketUrl = (): string => {
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
