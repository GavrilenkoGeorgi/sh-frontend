import React, { type FC } from 'react'

import styles from './LoadingNotification.module.sass'

const LoadingNotification: FC = () => {

  return <div className={styles.container}>
    <div className={styles.loader}>
      Loading...
    </div>
  </div>
}

export default LoadingNotification
