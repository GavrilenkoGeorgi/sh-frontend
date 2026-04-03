import { FC, useMemo } from 'react'
import {
  selectActiveGame,
  selectOnlineUsers,
  selectSocketConnected
} from '../store/slices/multiplayerSlice'
import { selectCurrentUser } from '../store/slices/authSlice'
import { emitInviteSend } from '../features/multiplayer/socket/multiplayerSocket'
import * as sharedStyles from './SharedStyles.module.sass'
import * as inviteStyles from '../features/multiplayer/components/InviteInbox.module.sass'
import * as styles from './Multiplayer.module.sass'
import { useSelector } from 'react-redux'
import CircleSvg from '../public/img/circle.svg'
import LoadingIndicator from '../components/layout/LoadingIndicator'
import InviteInbox from '../features/multiplayer/components/InviteInbox'
import OutgoingInvitesPanel from '../features/multiplayer/components/OutgoingInvitesPanel'
import MultiplayerGameBoard from '../features/multiplayer/components/MultiplayerGameBoard'

const Multiplayer: FC = () => {
  const socketConnected = useSelector(selectSocketConnected)
  const onlineUsers = useSelector(selectOnlineUsers)
  const currentUser = useSelector(selectCurrentUser)
  const activeGame = useSelector(selectActiveGame)

  const otherUsers = useMemo(
    () => onlineUsers.filter((user) => user.userId !== currentUser?._id),
    [onlineUsers, currentUser]
  )

  if (!socketConnected) {
    return <LoadingIndicator />
  }

  if (activeGame) {
    return <MultiplayerGameBoard />
  }

  return (
    <section className={sharedStyles.contentPage}>
      <h1 style={{ margin: 0 }}>Multiplayer</h1>
      <p className={styles.userCounter}>{otherUsers.length} online</p>
      <InviteInbox />
      <OutgoingInvitesPanel />
      {otherUsers.length === 0 ? (
        <p className={styles.emptyState}>No other players online right now</p>
      ) : (
        <>
          <h2 className={inviteStyles.heading} style={{ marginTop: '.75rem' }}>
            Select a player to send an invite
          </h2>
          <ul className={styles.userList}>
            {otherUsers.map((user) => (
              <li key={user.userId} className={styles.userNameContainer}>
                <div className={styles.statusIcon}>
                  <CircleSvg />
                </div>
                {user.username}
                <InviteButton onClick={() => emitInviteSend(user.userId)} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

interface InviteButtonProps {
  onClick: () => void
}

const InviteButton: FC<InviteButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className={styles.inviteButton}>
      Invite
    </button>
  )
}

export default Multiplayer
