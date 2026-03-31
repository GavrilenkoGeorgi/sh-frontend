import { FC } from 'react'
import {
  selectOnlineUsers,
  selectSocketConnected
} from '../store/slices/multiplayerSlice'
import * as sharedStyles from './SharedStyles.module.sass'
import * as styles from './Multiplayer.module.sass'
import { useSelector } from 'react-redux'
import CircleSvg from '../public/img/circle.svg'
import LoadingIndicator from '../components/layout/LoadingIndicator'

const Multiplayer: FC = () => {
  const socketConnected = useSelector(selectSocketConnected)
  const onlineUsers = useSelector(selectOnlineUsers)

  if (!socketConnected) {
    return <LoadingIndicator />
  }

  return (
    <section className={sharedStyles.contentPage}>
      <h1 style={{ margin: 0 }}>Multiplayer </h1>
      <p className={styles.userCounter}>{onlineUsers.length} online</p>
      <p style={{ margin: 0 }}>Select a player to send an invite</p>
      <ul className={styles.userList}>
        {onlineUsers.map((user) => (
          <li key={user.userId} className={styles.userNameContainer}>
            <div className={styles.statusIcon}>
              <CircleSvg />
            </div>
            {user.username}
            <InviteButton
              username={user.username}
              onClick={() => console.log(`Invite sent to ${user.username}`)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

interface InviteButtonProps {
  username: string
  onClick: () => void
}

const InviteButton: FC<InviteButtonProps> = ({ username, onClick }) => {
  return (
    <button onClick={onClick} className={styles.inviteButton}>
      Invite
    </button>
  )
}

export default Multiplayer
