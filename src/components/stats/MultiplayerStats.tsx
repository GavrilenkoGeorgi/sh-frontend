import { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetMultiplayerStatsQuery } from '../../store/api/gameApi'
import Fallback from '../layout/Fallback'
import * as styles from './MultiplayerStats.module.sass'

const MultiplayerStats: FC = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useGetMultiplayerStatsQuery()

  if (isLoading) {
    return <Fallback />
  }

  return (
    <div className={styles.multiplayerStats}>
      <h2>{t('ui.multiplayer.stats.heading')}</h2>
      <div>
        <p>
          {t('ui.multiplayer.stats.totalGames')}{' '}
          {data?.metaData.totalGames || 0}
        </p>
        <p>
          {t('ui.multiplayer.stats.wins')} {data?.metaData.wins || 0}
        </p>
        <p>
          {t('ui.multiplayer.stats.losses')} {data?.metaData.losses || 0}
        </p>
        <p>
          {t('ui.multiplayer.stats.ties')} {data?.metaData.ties || 0}
        </p>
      </div>
    </div>
  )
}

export default MultiplayerStats
