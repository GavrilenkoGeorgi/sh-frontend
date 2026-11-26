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
import cx from 'classnames'
import { useDebugForceMultiplayerBoard } from '../hooks/useDebugForceMultiplayerBoard'
import { useGetInvitableUsersQuery } from '../store/api/inviteApi'
import CircleSvg from '../public/img/circle.svg'
import InviteInbox from '../features/multiplayer/components/InviteInbox'
import PushOptInPrompt from '../features/multiplayer/components/PushOptInPrompt'
import OutgoingInvitesPanel from '../features/multiplayer/components/OutgoingInvitesPanel'
import MultiplayerGameBoard from '../features/multiplayer/components/MultiplayerGameBoard'
import MultiplayerGameEndModal from '../features/multiplayer/components/MultiplayerGameEndModal'
import { useTranslation } from 'react-i18next'
import { useInviteDeepLink } from '../hooks/useInviteDeepLink'
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
  const { data: invitableData } = useGetInvitableUsersQuery()
  useInviteDeepLink()

  const otherUsers = useMemo(
    () => onlineUsers.filter((user) => user.userId !== currentUser?._id),
    [onlineUsers, currentUser]
  )

  // online users first, the sort is stable so the server order is kept otherwise
  const invitableUsers = useMemo(
    () =>
      [...(invitableData?.users ?? [])].sort(
        (first, second) => Number(second.online) - Number(first.online)
      ),
    [invitableData]
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
      <PushOptInPrompt />
      <InviteInbox />
      <OutgoingInvitesPanel />
      {invitableUsers.length === 0 ? (
        <p className={styles.emptyState}>
          {t('ui.multiplayer.noPlayersOnline')}
        </p>
      ) : (
        <>
          <h2 className={inviteStyles.heading}>
            {t('ui.multiplayer.selectPlayerToInvite')}
          </h2>
          <ul className={styles.userList}>
            {invitableUsers.map((user) => (
              <li key={user.userId} className={styles.userNameContainer}>
                <div
                  className={cx(styles.statusIcon, {
                    [styles.offline]: !user.online
                  })}
                >
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
