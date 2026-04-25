import { FC } from 'react'
import * as styles from './InviteButton.module.sass'
import { useTranslation } from 'react-i18next'

interface InviteButtonProps {
  onClick: () => void
}

export const InviteButton: FC<InviteButtonProps> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <button onClick={onClick} className={styles.inviteButton}>
      {t('ui.buttonLabels.invite')}
    </button>
  )
}
