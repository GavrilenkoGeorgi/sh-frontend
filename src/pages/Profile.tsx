import React, { type FC } from 'react'

import ProfileForm from '../components/forms/Profile'
import DeleteProfile from '../components/forms/DeleteProfile'
import type { RootState } from '../store'
import { useSelector } from 'react-redux'

import styles from './Profile.module.sass'

const Profile: FC = () => {

  const { userInfo } = useSelector((state: RootState) => state.auth)

  return <section className={styles.container}>
    <h1>Profile</h1>
    <ProfileForm data={userInfo} />
    <DeleteProfile />
  </section>
}

export default Profile
