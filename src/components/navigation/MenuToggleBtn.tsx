import React, { type FC } from 'react'

import type { ToggleBtnProps } from '../../types'
import styles from './MenuToggleBtn.module.sass'

export const MenuToggleBtn: FC<ToggleBtnProps> = ({ open }) => {
  return <button
    aria-label='Open navigation menu.'
    className={styles.button}
  >
    <span className={`${styles.toggleIcon} ${open && styles.active}`}>
    </span>
  </button>
}
