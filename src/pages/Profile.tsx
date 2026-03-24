import React, { type FC } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import { selectCurrentUser } from '../store/slices/authSlice'
import ProfileForm from '../components/forms/Profile'

import * as styles from './Profile.module.sass'

const Profile: FC = () => {
  const user = useSelector(selectCurrentUser)

  return (
    <section className={styles.container}>
      <h1>Update profile</h1>
      <ProfileForm data={user} />
      <aside className={styles.text}>
        <p>
          Looking for a way to{' '}
          <Link to="/deleteacc" viewTransition>
            delete your account
          </Link>{' '}
          or{' '}
          <Link to="/clearstats" viewTransition>
            clear stats
          </Link>
          ?
        </p>
      </aside>
    </section>
  )
}

export default Profile
