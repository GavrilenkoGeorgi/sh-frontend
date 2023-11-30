import React, { type FC } from 'react'
import LoadingIndicator from './LoadingIndicator'

import styles from './Fallback.module.sass'

const Fallback: FC = () => {

  return <div className={styles.layout}>
    <LoadingIndicator dark large />
  </div>
}

export default Fallback
