import React, { type FC } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import * as styles from './SharedStyles.module.sass'

const Privacy: FC = () => {
  const { t } = useTranslation()

  const personalInfoItems = t('pages.privacy.infoWeCollect.personalInfoItems', {
    returnObjects: true
  }) as string[]
  const howWeUseItems = t('pages.privacy.howWeUse.items', {
    returnObjects: true
  }) as string[]

  return (
    <section className={styles.contentPage}>
      <h1>{t('pages.privacy.title')}</h1>
      <p className={styles.dateStamp}>{t('pages.privacy.lastUpdated')}</p>
      <article>
        <p>
          <Trans i18nKey="pages.privacy.intro">
            {
              "Thank you for choosing to use Sharlushka Dice Game ('us', 'we', or 'our'). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy or practices with regards to your personal information, please contact us at "
            }
            <a href="mailto:gavrilenko.georgi@gmail.com">
              gavrilenko.georgi@gmail.com
            </a>
            {
              '. By using the Sharlushka Dice Game, you agree to the terms of this privacy policy. Please take the time to read through the following information.'
            }
          </Trans>
        </p>
        <h2>{t('pages.privacy.infoWeCollect.heading')}</h2>
        <p>
          {t('pages.privacy.infoWeCollect.personalInfoHeading')} <br />
          {t('pages.privacy.infoWeCollect.personalInfoText')}
        </p>
        <ul>
          {personalInfoItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          {t('pages.privacy.infoWeCollect.autoCollectedHeading')} <br />
          {t('pages.privacy.infoWeCollect.autoCollectedText')}
        </p>
        <h2>{t('pages.privacy.howWeUse.heading')}</h2>
        <p>{t('pages.privacy.howWeUse.intro')}</p>
        <ul>
          {howWeUseItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>{t('pages.privacy.sharing.heading')}</h2>
        <p>{t('pages.privacy.sharing.text')}</p>

        <h2>{t('pages.privacy.security.heading')}</h2>
        <p>{t('pages.privacy.security.text')}</p>

        <h2>{t('pages.privacy.changes.heading')}</h2>
        <p>{t('pages.privacy.changes.text')}</p>

        <h2>{t('pages.privacy.contact.heading')}</h2>
        <p>
          <Trans i18nKey="pages.privacy.contact.text">
            {
              'If you have any questions about this privacy policy, please contact us at '
            }
            <a href="mailto:gavrilenko.georgi@gmail.com">
              gavrilenko.georgi@gmail.com
            </a>
            {'.'}
          </Trans>
        </p>
      </article>
    </section>
  )
}

export default Privacy
