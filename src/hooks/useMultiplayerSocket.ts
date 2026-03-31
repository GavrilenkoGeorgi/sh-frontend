import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  connectMultiplayerSocket,
  disconnectMultiplayerSocket,
  multiplayerSocket
} from '../features/multiplayer/socket/multiplayerSocket'
import type { PresenceOnlineUsersPayload } from '../features/multiplayer/types'
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

export const useMultiplayerSocket = () => {
  const dispatch = useDispatch()
  const authInitialized = useSelector(selectAuthInitialized)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!authInitialized) {
      return
    }

    const handleConnect = () => {
      dispatch(setSocketConnected(true))
      dispatch(setMultiplayerError(null))
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

    multiplayerSocket.on('connect', handleConnect)
    multiplayerSocket.on('disconnect', handleDisconnect)
    multiplayerSocket.on('connect_error', handleConnectError)
    multiplayerSocket.on('presence:online-users', handleOnlineUsers)

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
    }
  }, [authInitialized, dispatch, isAuthenticated])
}
