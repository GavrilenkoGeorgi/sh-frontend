import { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useGetIncomingInvitesQuery } from '../../../store/api/inviteApi'
import { setSelectedInviteId } from '../../../store/slices/multiplayerSlice'
import {
  emitInviteAccept,
  emitInviteDecline
} from '../socket/multiplayerSocket'
import type { IncomingInvite } from '../types'
import * as styles from './InviteInbox.module.sass'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/layout/Button/BaseButton'

const InviteInbox: FC = () => {
  const { data } = useGetIncomingInvitesQuery()
  const { t } = useTranslation()

  if (!data || data.invites.length === 0) {
    return null
  }

  return (
    <section className={styles.inviteInbox}>
      <h2 className={styles.heading}>{t('ui.multiplayer.incomingInvites')}</h2>
      <ul className={styles.inviteList}>
        {data.invites.map((invite) => (
          <InviteItem key={invite.inviteId} invite={invite} />
        ))}
      </ul>
    </section>
  )
}

interface InviteItemProps {
  invite: IncomingInvite
}

const InviteItem: FC<InviteItemProps> = ({ invite }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleAccept = useCallback(() => {
    emitInviteAccept(invite.inviteId)
    dispatch(setSelectedInviteId(null))
  }, [dispatch, invite.inviteId])

  const handleDecline = useCallback(() => {
    emitInviteDecline(invite.inviteId)
    dispatch(setSelectedInviteId(null))
  }, [dispatch, invite.inviteId])

  return (
    <li className={styles.inviteItem}>
      <span className={styles.fromUser}>{invite.fromUser.username}</span>
      <div className={styles.actions}>
        <Button onClick={handleAccept} size="sm">
          {t('ui.buttonLabels.accept')}
        </Button>
        <Button onClick={handleDecline} size="sm" variant="warning">
          {t('ui.buttonLabels.decline')}
        </Button>
      </div>
    </li>
  )
}

export default InviteInbox
