import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  connectMultiplayerSocket,
  disconnectMultiplayerSocket,
  multiplayerSocket
} from '../features/multiplayer/socket/multiplayerSocket'
import type {
  InviteReceivedPayload,
  InviteStatusPayload,
  PresenceOnlineUsersPayload
} from '../features/multiplayer/types'
import {
  resetMultiplayerState,
  setMultiplayerError,
  setOnlineUsers,
  setSocketConnected,
  setSocketDisconnected
} from '../store/slices/multiplayerSlice'
import {
  selectAuthInitialized,
  selectIsAuthenticated
} from '../store/slices/authSlice'
import { apiSlice } from '../store/slices/apiSlice'
import type { AppDispatch } from '../store'

export const useMultiplayerSocket = () => {
  const dispatch = useDispatch<AppDispatch>()
  const authInitialized = useSelector(selectAuthInitialized)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!authInitialized) {
      return
    }

    const invalidateInvites = () => {
      dispatch(
        apiSlice.util.invalidateTags(['IncomingInvites', 'OutgoingInvites'])
      )
    }

    const handleConnect = () => {
      dispatch(setSocketConnected(true))
      dispatch(setMultiplayerError(null))
      // refetch invites on reconnect
      invalidateInvites()
    }

    const handleDisconnect = () => {
      dispatch(setSocketDisconnected())
    }

    const handleConnectError = (error: Error) => {
      dispatch(setMultiplayerError(error.message))
    }

    const handleOnlineUsers = (payload: PresenceOnlineUsersPayload) => {
      dispatch(setOnlineUsers(payload.users))
    }

    const handleInviteReceived = (_payload: InviteReceivedPayload) => {
      dispatch(apiSlice.util.invalidateTags(['IncomingInvites']))
    }

    const handleInviteStatus = (_payload: InviteStatusPayload) => {
      invalidateInvites()
    }

    multiplayerSocket.on('connect', handleConnect)
    multiplayerSocket.on('disconnect', handleDisconnect)
    multiplayerSocket.on('connect_error', handleConnectError)
    multiplayerSocket.on('presence:online-users', handleOnlineUsers)
    multiplayerSocket.on('invite:received', handleInviteReceived)
    multiplayerSocket.on('invite:status', handleInviteStatus)

    if (isAuthenticated) {
      connectMultiplayerSocket()
    } else {
      disconnectMultiplayerSocket()
      dispatch(resetMultiplayerState())
    }

    return () => {
      multiplayerSocket.off('connect', handleConnect)
      multiplayerSocket.off('disconnect', handleDisconnect)
      multiplayerSocket.off('connect_error', handleConnectError)
      multiplayerSocket.off('presence:online-users', handleOnlineUsers)
      multiplayerSocket.off('invite:received', handleInviteReceived)
      multiplayerSocket.off('invite:status', handleInviteStatus)
    }
  }, [authInitialized, dispatch, isAuthenticated])
}
