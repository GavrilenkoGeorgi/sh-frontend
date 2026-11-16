import { FC } from 'react'
import * as styles from './TurnLoader.module.sass'

interface TurnLoaderProps {
  className?: string
}

export const TurnLoader: FC<TurnLoaderProps> = ({ className = '' }) => {
  return (
    <div
      className={`${styles.turnLoader} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label="Opponent's turn..."
    >
      <span className={styles.dots} aria-hidden="true" />
    </div>
  )
}
