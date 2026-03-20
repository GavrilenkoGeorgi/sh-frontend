import React, { type FC } from 'react'

import type { ToggleBtnProps } from '../../types'
import * as styles from './MenuToggleBtn.module.sass'

export const MenuToggleBtn: FC<ToggleBtnProps> = ({ open, onClick }) => {
  return (
    <button
      aria-label="Open navigation menu."
      className={styles.button}
      onClick={onClick}
    >
      <span className={`${styles.toggleIcon} ${open && styles.active}`}></span>
    </button>
  )
}
