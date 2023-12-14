import React, { type FC } from 'react'
import ClearStatsForm from '../components/forms/ClearStats'
import styles from './SharedStyles.module.sass'

const ClearStats: FC = () => {
  return <section className={styles.container}>
    <h1 className={styles.pageHeading}>Clear stats</h1>
    <p>
      To delete all your saved game results and clear stats,
      click the button below.
      Please note that this action is irreversible.
    </p>
    <ClearStatsForm />
  </section>
}

export default ClearStats
