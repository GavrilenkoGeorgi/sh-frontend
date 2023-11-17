import React, { type FC } from 'react'
import styles from './LoadingIndicator.module.sass'
import cx from 'classnames'

interface LoadingIndicatorProps {
  dark?: boolean
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ dark }) => {
  return <span className={cx(styles.loader, { [styles.dark]: dark })}></span>
}

export default LoadingIndicator
