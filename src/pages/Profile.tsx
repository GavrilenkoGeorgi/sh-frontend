import { type FC } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import { selectCurrentUser } from '../store/slices/authSlice'
import ProfileForm from '../components/forms/Profile'
import { ROUTES } from '../constants/routes'

import * as styles from './Profile.module.sass'
import { toPath } from '../utils'

const Profile: FC = () => {
  const user = useSelector(selectCurrentUser)

  return (
    <section className={styles.container}>
      <h1>Update profile</h1>
      <ProfileForm data={user} />
      <aside className={styles.text}>
        Looking for a way to{' '}
        <Link to={toPath(ROUTES.DELETE_ACCOUNT)} viewTransition>
          delete your account
        </Link>{' '}
        or{' '}
        <Link to={toPath(ROUTES.CLEAR_STATS)} viewTransition>
          clear stats
        </Link>
        ?
        <br />
      </aside>
    </section>
  )
}

export default Profile
