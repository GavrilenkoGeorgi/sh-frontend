import { type FC } from 'react'
import { type ProgressBar } from '../../types'
import * as styles from './ProgressBar.module.sass'

const ProgressBar: FC<ProgressBar> = ({ count }) => {
  let width

  if (count === 0) {
    width = 0
  } else {
    const fraction = 3
    const percent = fraction * count * 11.075
    width = Math.round(Math.abs(percent))
  }

  return (
    <div className={styles.progressBar} style={{ width: `${width}%` }}></div>
  )
}

export default ProgressBar
