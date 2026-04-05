import { FC } from 'react'
import * as styles from './UserLink.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'
import UserIcon from '../../assets/svg/icon-user.svg'
import { selectCurrentUser } from '../../store/slices/authSlice'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { ROUTES } from '../../constants/routes'
import { toPath } from '../../utils'

export const UserLink: FC = () => {
  const user = useSelector(selectCurrentUser)
  const { busy } = useSelector(
    (state: { notification: { busy: boolean } }) => state.notification
  )

  return (
    <>
      <div className={styles.user}>
        <Link
          to={user != null ? toPath(ROUTES.PROFILE) : toPath(ROUTES.LOGIN)}
          viewTransition
          className={styles.userName}
          aria-label={user?.name ?? 'Guest'}
        >
          <UserIcon />
        </Link>
        {user && (
          <Link
            to={toPath(ROUTES.STATS)}
            viewTransition
            className={styles.userName}
            aria-label={user.name}
          >
            {user.name}
          </Link>
        )}
        {busy && <LoadingIndicator dark />}
      </div>
    </>
  )
}
