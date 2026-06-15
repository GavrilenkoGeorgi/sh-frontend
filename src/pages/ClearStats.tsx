import { type FC } from 'react'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '../store/slices/authSlice'
import ClearStatsForm from '../components/forms/ClearStats'
import * as styles from './SharedStyles.module.sass'
import { Trans, useTranslation } from 'react-i18next'

const ClearStats: FC = () => {
  const user = useSelector(selectCurrentUser)
  const { t } = useTranslation()

  return (
    <section className={styles.contentPage}>
      <h1 className={styles.pageHeading}>{t('pages.clearStats.heading')}</h1>
      <p>
        <Trans i18nKey="pages.clearStats.info">
          To delete all your saved game results and clear stats login into your
          account and navigate to this page. For any questions or assistance
          regarding deleting the results, contact us at
          <a href="mailto:sharlushka.game@gmail.com">
            sharlushka.game@gmail.com
          </a>
          .
        </Trans>
      </p>
      {user != null && (
        <>
          <p>{t('pages.clearStats.warning')}</p>
          <ClearStatsForm />
        </>
      )}
    </section>
  )
}

export default ClearStats
