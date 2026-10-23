import { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetMultiplayerStatsQuery } from '../../store/api/gameApi'
import Fallback from '../layout/Fallback'
import * as styles from './MultiplayerStats.module.sass'
import { useGetUserProfileByIdQuery } from '../../store/api/userApi'

const MultiplayerStats: FC = () => {
  const { t } = useTranslation()

  const { data, isLoading: isStatsLoading } = useGetMultiplayerStatsQuery()
  const [lastGame] = data?.results || []
  const opponentId = lastGame?.opponentId

  // skip the query if we don't have the ID yet
  const { data: userData, isLoading: isUserLoading } =
    useGetUserProfileByIdQuery(opponentId ?? '', {
      skip: !opponentId
    })

  if (isStatsLoading || isUserLoading) {
    return <Fallback />
  }

  // Render your component with lastGame and userData
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
      <h3>{t('ui.multiplayer.stats.lastGame')}</h3>
      <div className={styles.lastGame}>
        <p>
          You (<span className={styles.accent}>{lastGame.finalScore}</span>) vs{' '}
          {userData?.name || 'Unknown Opponent'} ({lastGame.opponentScore}){' '}
          <span className={styles.accent}>{lastGame.outcome}</span>
        </p>
      </div>
    </div>
  )
}

export default MultiplayerStats
