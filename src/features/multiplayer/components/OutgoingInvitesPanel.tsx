import { FC } from 'react'
import { useGetOutgoingInvitesQuery } from '../../../store/slices/inviteApiSlice'
import type { OutgoingInvite } from '../types'
import * as styles from './InviteInbox.module.sass'

const OutgoingInvitesPanel: FC = () => {
  const { data, isLoading } = useGetOutgoingInvitesQuery()

  if (isLoading || data?.invites.length === 0) {
    return null
  }

  return (
    <section className={styles.inviteInbox}>
      <h2 className={styles.heading}>Outgoing invites</h2>
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
