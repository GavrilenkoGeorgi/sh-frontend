import { FC } from 'react'
import { useGetOutgoingInvitesQuery } from '../../../store/slices/inviteApiSlice'
import type { OutgoingInvite } from '../types'
import * as styles from './InviteInbox.module.sass'
import { useTranslation } from 'react-i18next'

const OutgoingInvitesPanel: FC = () => {
  const { data, isLoading } = useGetOutgoingInvitesQuery()
  const { t } = useTranslation()

  if (isLoading || data?.invites.length === 0) {
    return null
  }

  return (
    <section className={styles.inviteInbox}>
      <h2 className={styles.heading}>{t('ui.multiplayer.outgoingInvites')}</h2>
      <ul className={styles.inviteList}>
        {data?.invites.map((invite) => (
          <OutgoingInviteItem key={invite.inviteId} invite={invite} />
        ))}
      </ul>
    </section>
  )
}

interface OutgoingInviteItemProps {
  invite: OutgoingInvite
}

const OutgoingInviteItem: FC<OutgoingInviteItemProps> = ({ invite }) => {
  return (
    <li className={styles.inviteItem}>
      <span className={styles.fromUser}>{invite.toUser.username}</span>
      <span>{invite.status}</span>
    </li>
  )
}

export default OutgoingInvitesPanel
