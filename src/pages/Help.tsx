import { type FC } from 'react'
import { useTranslation, Trans } from 'react-i18next'

import HelpDice from '../components/layout/HelpDice'
import * as styles from './SharedStyles.module.sass'

import data from '../assets/data/HelpPage.json'
import { RunTourButton } from '../components/tour/RunTourButton'

const Help: FC = () => {
  const { t } = useTranslation()

  return (
    <section className={styles.contentPage}>
      <h1>{t('pages.help.title')}</h1>
      <article>
        <Trans i18nKey="pages.help.intro">
          {
            'Each turn consists of a maximum of three rolls — the first roll to be made with all five dice. If the player elects to roll a second and third time, he may pick up and use any number of dice, providing a score is taken on the last roll. It is the skillful use of these two optional rolls of the dice that can turn an unlucky first or second roll into a high scoring turn. Take a '
          }
          <RunTourButton label={t('pages.help.tourButtonLabel')} />
          {' to see how the game works in practice.'}
        </Trans>
      </article>
      <h2>{t('pages.help.exampleScoresHeading')}</h2>
      <aside>
        <h3>{t('pages.help.schoolHeading')}</h3>
        <HelpDice data={data.slice(0, 8)} />
      </aside>
      <aside>
        <h3>{t('pages.help.gameHeading')}</h3>
        <HelpDice data={data.slice(-11)} />
      </aside>
    </section>
  )
}

export default Help
