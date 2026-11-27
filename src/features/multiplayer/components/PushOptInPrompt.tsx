import { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePushNotifications } from '../../../hooks/usePushNotifications'
import { Button } from '../../../components/layout/Button/BaseButton'
import * as styles from './InviteInbox.module.sass'

const PushOptInPrompt: FC = () => {
  const { t } = useTranslation()
  const { supported, permission, enable } = usePushNotifications()
  const [dismissed, setDismissed] = useState(false)

  if (!supported || permission !== 'default' || dismissed) {
    return null
  }

  return (
    <section className={styles.inviteInbox}>
      <div className={styles.inviteItem}>
        <span>{t('ui.push.promptText')}</span>
        <div className={styles.actions}>
          <Button onPress={enable} size="sm">
            {t('ui.push.enable')}
          </Button>
          <Button
            onPress={() => setDismissed(true)}
            size="sm"
            variant="secondary"
          >
            {t('ui.push.notNow')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PushOptInPrompt
