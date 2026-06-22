import { type FC } from 'react'

import type { ToggleBtnProps } from '../../types'
import * as styles from './MenuToggleBtn.module.sass'
import { Button } from '../layout/Button/BaseButton'

export const MenuToggleBtn: FC<ToggleBtnProps> = ({ open, onClick }) => {
  return (
    <Button
      aria-label="Open navigation menu."
      className={styles.toggleButton}
      onClick={onClick}
      variant="invisible"
      size="tiny"
    >
      <span className={`${styles.toggleIcon} ${open && styles.active}`}></span>
    </Button>
  )
}
