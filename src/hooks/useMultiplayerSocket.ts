import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  connectMultiplayerSocket,
  disconnectMultiplayerSocket,
  multiplayerSocket
} from '../features/multiplayer/socket/multiplayerSocket'
import type {
  GameEndedPayload,
  GameStartedPayload,
  GameStateUpdatedPayload,
  InviteErrorPayload,
  InviteReceivedPayload,
  InviteStatusPayload,
  PresenceOnlineUsersPayload
} from '../features/multiplayer/types'
import {
  resetMultiplayerState,
  setActiveGame,
  setGameEnded,
  setMultiplayerError,
  setOnlineUsers,
  setSocketConnected,
  setSocketDisconnected,
  updateGameState
} from '../store/slices/multiplayerSlice'
import {
  selectAuthInitialized,
  selectIsAuthenticated
} from '../store/slices/authSlice'
import type { AppDispatch } from '../store'
import { userApi } from '../store/api/baseApi'
import { USER_TAGS } from '../store/api/tags'
import { setNotification } from '../store/slices/notificationSlice'
import { ToastTypes } from '../types'
import i18n from '../i18n'

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
        userApi.util.invalidateTags([
          USER_TAGS.IncomingInvites,
          USER_TAGS.OutgoingInvites
        ])
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
      // keeps the online status in the invitable users list fresh
      dispatch(userApi.util.invalidateTags([USER_TAGS.InvitableUsers]))
    }

    const handleInviteReceived = (payload: InviteReceivedPayload) => {
      dispatch(userApi.util.invalidateTags([USER_TAGS.IncomingInvites]))
      dispatch(
        setNotification({
          msg: i18n.t('ui.toastMessages.inviteReceived', {
            username: payload.fromUser.username
          }),
          type: ToastTypes.INFO
        })
      )
    }

    const handleInviteError = (payload: InviteErrorPayload) => {
      dispatch(
        setNotification({ msg: payload.message, type: ToastTypes.ERROR })
      )
    }

    const handleInviteStatus = (_payload: InviteStatusPayload) => {
      invalidateInvites()
    }

    const handleGameStarted = (payload: GameStartedPayload) => {
      dispatch(
        setActiveGame({
          gameState: payload.gameState,
          opponent: payload.opponent
        })
      )
    }

    const handleGameStateUpdated = (payload: GameStateUpdatedPayload) => {
      dispatch(updateGameState(payload.gameState))
    }
    // TODO: handle game error properly
    /* const handleGameError = (payload: { message: string }) => {
      console.error('[mp-debug] received game:error', payload)
    } */

    const handleGameEnded = (payload: GameEndedPayload) => {
      dispatch(setGameEnded(payload))
    }

    multiplayerSocket.on('connect', handleConnect)
    multiplayerSocket.on('disconnect', handleDisconnect)
    multiplayerSocket.on('connect_error', handleConnectError)
    multiplayerSocket.on('presence:online-users', handleOnlineUsers)
    multiplayerSocket.on('invite:received', handleInviteReceived)
    multiplayerSocket.on('invite:status', handleInviteStatus)
    multiplayerSocket.on('invite:error', handleInviteError)
    multiplayerSocket.on('game:started', handleGameStarted)
    multiplayerSocket.on('game:state-updated', handleGameStateUpdated)
    multiplayerSocket.on('game:ended', handleGameEnded)
    // multiplayerSocket.on('game:error', handleGameError)

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
      multiplayerSocket.off('invite:error', handleInviteError)
      multiplayerSocket.off('game:started', handleGameStarted)
      multiplayerSocket.off('game:state-updated', handleGameStateUpdated)
      multiplayerSocket.off('game:ended', handleGameEnded)
      // multiplayerSocket.off('game:error', handleGameError)
    }
  }, [authInitialized, dispatch, isAuthenticated])
}
