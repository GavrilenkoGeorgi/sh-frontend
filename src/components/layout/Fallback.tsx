import React, { type FC } from 'react'
import LoadingIndicator from './LoadingIndicator'

import styles from './Fallback.module.sass'

const Fallback: FC = () => {

  return <div className={styles.layout}>
    <div className={styles.container}>
     <LoadingIndicator dark />
    </div>
  </div>
}

export default Fallback
