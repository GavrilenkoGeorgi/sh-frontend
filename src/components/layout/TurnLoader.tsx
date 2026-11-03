import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as styles from './TurnLoader.module.sass'

interface TurnLoaderProps {
  /** Optional active player name. If omitted, falls back to generic opponent text. */
  playerName?: string
  className?: string
}

export const TurnLoader: FC<TurnLoaderProps> = ({
  playerName,
  className = ''
}) => {
  const { t } = useTranslation()

  const label = playerName
    ? t('ui.loader.player_turn', {
        name: playerName,
        defaultValue: `${playerName}'s turn`
      })
    : t('ui.loader.opponents_turn', { defaultValue: "Opponent's turn" })

  return (
    <div
      className={`${styles.turnLoader} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={`${label}...`}
    >
      <span className={styles.text}>{label}</span>
      <span className={styles.dots} aria-hidden="true" />
    </div>
  )
}
