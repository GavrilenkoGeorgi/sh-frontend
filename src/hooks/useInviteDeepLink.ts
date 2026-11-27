import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'
import { emitInviteAccept } from '../features/multiplayer/socket/multiplayerSocket'
import { selectSocketConnected } from '../store/slices/multiplayerSlice'

// accepts the invite when the app was opened from the push "Accept" action
export const useInviteDeepLink = (): void => {
  const [searchParams, setSearchParams] = useSearchParams()
  const socketConnected = useSelector(selectSocketConnected)

  const inviteId = searchParams.get('inviteId')
  const shouldAutoAccept = searchParams.get('autoAccept') === '1'

  useEffect(() => {
    if (!inviteId || !shouldAutoAccept || !socketConnected) return

    emitInviteAccept(inviteId)
    // clear the params so a reload never accepts twice
    setSearchParams({}, { replace: true })
  }, [inviteId, shouldAutoAccept, socketConnected, setSearchParams])
}
