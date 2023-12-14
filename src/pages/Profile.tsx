import React, { type FC } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import type { RootState } from '../store'
import ProfileForm from '../components/forms/Profile'

import styles from './Profile.module.sass'

const Profile: FC = () => {

  const { userInfo } = useSelector((state: RootState) => state.auth)

  return <section className={styles.container}>
    <h1>Update profile</h1>
    <ProfileForm data={userInfo} />
    <aside className={styles.text}>
      <p>
        Looking for a way to <Link to='/deleteacc'>
        delete you account?</Link>
      </p>
    </aside>
  </section>
}

export default Profile
