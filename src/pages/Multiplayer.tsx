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
import { useDebugForceMultiplayerBoard } from '../hooks/useDebugForceMultiplayerBoard'
import CircleSvg from '../public/img/circle.svg'
import InviteInbox from '../features/multiplayer/components/InviteInbox'
import OutgoingInvitesPanel from '../features/multiplayer/components/OutgoingInvitesPanel'
import MultiplayerGameBoard from '../features/multiplayer/components/MultiplayerGameBoard'
import MultiplayerGameEndModal from '../features/multiplayer/components/MultiplayerGameEndModal'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/layout/Button/BaseButton'
import Fallback from '../components/layout/Fallback'

const Multiplayer: FC = () => {
  const { t } = useTranslation()
  const socketConnected = useSelector(selectSocketConnected)
  const onlineUsers = useSelector(selectOnlineUsers)
  const currentUser = useSelector(selectCurrentUser)
  const activeGame = useSelector(selectActiveGame)
  const gameEndResult = useSelector(selectGameEndResult)
  const debugForceBoard = useDebugForceMultiplayerBoard()

  const otherUsers = useMemo(
    () => onlineUsers.filter((user) => user.userId !== currentUser?._id),
    [onlineUsers, currentUser]
  )

  if (!socketConnected && !debugForceBoard) {
    return <Fallback />
  }

  if (gameEndResult && !debugForceBoard) {
    return <MultiplayerGameEndModal />
  }

  if (activeGame || debugForceBoard) {
    return <MultiplayerGameBoard forcePreview={debugForceBoard} />
  }

  return (
    <section className={sharedStyles.contentPage}>
      <h1>{t('ui.headings.multiplayer')}</h1>
      <p className={styles.userCounter}>{otherUsers.length} online</p>
      <InviteInbox />
      <OutgoingInvitesPanel />
      {otherUsers.length === 0 ? (
        <p className={styles.emptyState}>
          {t('ui.multiplayer.noPlayersOnline')}
        </p>
      ) : (
        <>
          <h2 className={inviteStyles.heading}>
            {t('ui.multiplayer.selectPlayerToInvite')}
          </h2>
          <ul className={styles.userList}>
            {otherUsers.map((user) => (
              <li key={user.userId} className={styles.userNameContainer}>
                <div className={styles.statusIcon}>
                  <CircleSvg />
                </div>
                {user.username}
                <div
                  style={{
                    marginLeft: 'auto'
                  }}
                >
                  <Button onPress={() => emitInviteSend(user.userId)} size="sm">
                    {t('ui.buttonLabels.invite')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default Multiplayer
