import React, { type FC } from 'react'
import * as styles from './LoadingIndicator.module.sass'
import cx from 'classnames'

interface LoadingIndicatorProps {
  dark?: boolean
  large?: boolean
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ dark, large }) => {
  return (
    <span
      className={cx(styles.loader, {
        [styles.dark]: dark,
        [styles.large]: large
      })}
    ></span>
  )
}

export default LoadingIndicator
