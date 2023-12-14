import React, { type FC } from 'react'
import { useSelector } from 'react-redux'

import { type RootState } from '../store'
import ClearStatsForm from '../components/forms/ClearStats'
import styles from './SharedStyles.module.sass'

const ClearStats: FC = () => {

  const { userInfo } = useSelector((state: RootState) => state.auth)

  return <section className={styles.container}>
    <h1 className={styles.pageHeading}>Clear stats</h1>
    <p>
      To delete all your saved game results and clear stats
      login into your account and navigate to this page. <br />
      For any questions or assistance regarding deleting the results,
      contact us at <a href='mailto:gavrilenko.georgi@gmail.com'>gavrilenko.georgi@gmail.com</a>.
    </p>
    {userInfo != null && <>
      <p>
        Please note that this action is irreversible.
      </p>
      <ClearStatsForm />
    </>}
  </section>
}

export default ClearStats
