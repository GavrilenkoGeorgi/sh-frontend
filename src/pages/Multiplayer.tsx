import { FC, useMemo } from 'react'
import {
  selectActiveGame,
  selectGameEndResult,
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
import MultiplayerGameEndModal from '../features/multiplayer/components/MultiplayerGameEndModal'
import { useTranslation } from 'react-i18next'
import { InviteButton } from '../features/multiplayer/components/InviteButton'

const Multiplayer: FC = () => {
  const { t } = useTranslation()
  const socketConnected = useSelector(selectSocketConnected)
  const onlineUsers = useSelector(selectOnlineUsers)
  const currentUser = useSelector(selectCurrentUser)
  const activeGame = useSelector(selectActiveGame)
  const gameEndResult = useSelector(selectGameEndResult)

  // dev-only: allow forcing the multiplayer board to be shown for styling/debug.
  // enable by adding `?forceBoard=1` to the URL or setting `localStorage.setItem('sh.forceMultiplayerBoard','1')`
  const urlSearch = typeof window !== 'undefined' ? window.location.search : ''
  const params = new URLSearchParams(urlSearch)
  const devQueryForce = params.get('forceBoard') === '1'
  const devLocalForce =
    typeof window !== 'undefined' &&
    localStorage.getItem('sh.forceMultiplayerBoard') === '1'
  const debugForceBoard =
    process.env.NODE_ENV === 'development' && (devQueryForce || devLocalForce)

  const otherUsers = useMemo(
    () => onlineUsers.filter((user) => user.userId !== currentUser?._id),
    [onlineUsers, currentUser]
  )

  if (!socketConnected && !debugForceBoard) {
    return <LoadingIndicator />
  }

  if (gameEndResult && !debugForceBoard) {
    return <MultiplayerGameEndModal />
  }

  if (activeGame || debugForceBoard) {
    return <MultiplayerGameBoard forcePreview={debugForceBoard} />
  }

  return (
    <section className={sharedStyles.contentPage}>
      <h1 style={{ margin: 0 }}>{t('ui.headings.multiplayer')}</h1>
      <p className={styles.userCounter}>{otherUsers.length} online</p>
      <InviteInbox />
      <OutgoingInvitesPanel />
      {otherUsers.length === 0 ? (
        <p className={styles.emptyState}>
          {t('ui.multiplayer.noPlayersOnline')}
        </p>
      ) : (
        <>
          <h2 className={inviteStyles.heading} style={{ marginTop: '.75rem' }}>
            {t('ui.multiplayer.selectPlayerToInvite')}
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

export default Multiplayer
