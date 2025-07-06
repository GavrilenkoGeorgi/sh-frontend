import React from 'react'
import { FC } from 'react'
import * as styles from './UserLink.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'
import UserIcon from '../../assets/svg/icon-user.svg'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

export const UserLink: FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { busy } = useSelector((state: RootState) => state.notification)

  return (
    <>
      <div className={styles.user}>
        <Link
          to={userInfo != null ? ROUTES.PROFILE : ROUTES.LOGIN}
          className={styles.userName}
          aria-label={userInfo?.name ?? 'Guest'}
        >
          <UserIcon />
        </Link>
        {userInfo && (
          <Link
            to={ROUTES.STATS}
            className={styles.userName}
            aria-label={userInfo.name}
          >
            {userInfo.name}
          </Link>
        )}
        {busy && <LoadingIndicator dark />}
      </div>
    </>
  )
}
