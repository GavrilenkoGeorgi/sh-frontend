import { type FC } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import { selectCurrentUser } from '../store/slices/authSlice'
import ProfileForm from '../components/forms/Profile'
import { ROUTES } from '../constants/routes'

import * as styles from './Profile.module.sass'
import * as sharedStyles from './SharedStyles.module.sass'
import { toPath } from '../utils'
import { useTranslation, Trans } from 'react-i18next'

const Profile: FC = () => {
  const user = useSelector(selectCurrentUser)
  const { t } = useTranslation()

  return (
    <section className={sharedStyles.container}>
      <h1>{t('ui.headings.updateProfile')}</h1>
      <ProfileForm data={user} />
      <aside className={styles.text}>
        <Trans i18nKey="pages.profile.accountManagement">
          {'Looking for a way to '}
          <Link to={toPath(ROUTES.DELETE_ACCOUNT)} viewTransition>
            delete your account
          </Link>
          {' or '}
          <Link to={toPath(ROUTES.CLEAR_STATS)} viewTransition>
            clear stats
          </Link>
          ?
        </Trans>
        <br />
      </aside>
    </section>
  )
}

export default Profile
