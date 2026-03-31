import { FC, useMemo } from 'react'
import {
  selectOnlineUsers,
  selectSocketConnected
} from '../store/slices/multiplayerSlice'
import { selectCurrentUser } from '../store/slices/authSlice'
import { emitInviteSend } from '../features/multiplayer/socket/multiplayerSocket'
import * as sharedStyles from './SharedStyles.module.sass'
import * as styles from './Multiplayer.module.sass'
import { useSelector } from 'react-redux'
import CircleSvg from '../public/img/circle.svg'
import LoadingIndicator from '../components/layout/LoadingIndicator'

const Multiplayer: FC = () => {
  const socketConnected = useSelector(selectSocketConnected)
  const onlineUsers = useSelector(selectOnlineUsers)
  const currentUser = useSelector(selectCurrentUser)

  const otherUsers = useMemo(
    () => onlineUsers.filter((user) => user.userId !== currentUser?._id),
    [onlineUsers, currentUser]
  )

  if (!socketConnected) {
    return <LoadingIndicator />
  }

  return (
    <section className={sharedStyles.contentPage}>
      <h1 style={{ margin: 0 }}>Multiplayer</h1>
      <p className={styles.userCounter}>{otherUsers.length} online</p>
      {otherUsers.length === 0 ? (
        <p className={styles.emptyState}>No other players online right now</p>
      ) : (
        <>
          <p style={{ margin: 0 }}>Select a player to send an invite</p>
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
