import React, { type FC } from 'react'
import styles from './LoadingIndicator.module.sass'

const LoadingIndicator: FC = () => {
  return <span className={styles.loader}></span>
}

export default LoadingIndicator
