import { type FC, type ReactNode } from 'react'
import * as styles from './MultiplayerGameBoard.module.sass'

interface PillProps {
  children: ReactNode
}

// small inline label used to preview a list of items, e.g. combination names in a collapsed header
export const Pill: FC<PillProps> = ({ children }) => (
  <span className={styles.pill}>{children}</span>
)
