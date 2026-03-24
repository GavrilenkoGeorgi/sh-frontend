import React, { type FC } from 'react'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '../store/slices/authSlice'
import ClearStatsForm from '../components/forms/ClearStats'
import * as styles from './SharedStyles.module.sass'

const ClearStats: FC = () => {
  const user = useSelector(selectCurrentUser)

  return (
    <section className={styles.contentPage}>
      <h1 className={styles.pageHeading}>Clear stats</h1>
      <p>
        To delete all your saved game results and clear stats login into your
        account and navigate to this page. <br />
        For any questions or assistance regarding deleting the results, contact
        us at{' '}
        <a href="mailto:gavrilenko.georgi@gmail.com">
          gavrilenko.georgi@gmail.com
        </a>
        .
      </p>
      {user != null && (
        <>
          <p>Please note that this action is irreversible.</p>
          <ClearStatsForm />
        </>
      )}
    </section>
  )
}

export default ClearStats
