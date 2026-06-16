import { type FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useTranslation, Trans } from 'react-i18next'

import LoginForm from '../components/forms/Login'
import * as styles from './Main.module.sass'
import * as sharedStyles from './SharedStyles.module.sass'
import { link } from './Login.module.sass'
import Logo from '../assets/svg/sharlushka-logo.svg'
import { ROUTES } from '../constants/routes'
import { selectIsAuthenticated } from '../store/slices/authSlice'
import { toPath } from '../utils'

const Main: FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { t } = useTranslation()

  useEffect(() => {
    if (isAuthenticated) navigate(toPath(ROUTES.PLAY))
  }, [isAuthenticated])

  return (
    <section className={sharedStyles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <h1>{t('pages.main.greeting')}</h1>
      <div className={styles.intro}>
        <p>
          <Trans i18nKey="pages.main.intro">
            {'You '}
            <Link to={toPath(ROUTES.PLAY)} viewTransition>
              can play unregistered
            </Link>
            {
              ", but you will not be able to save results or checkout other player's stats, consider "
            }
            <Link to={toPath(ROUTES.REGISTER)} viewTransition>
              registering
            </Link>
            .
          </Trans>
        </p>
      </div>
      <LoginForm />
      <aside>
        <Link
          className={link}
          to={toPath(ROUTES.FORGOT_PASSWORD)}
          viewTransition
          aria-label={t('pages.login.forgotPassword')}
        >
          {t('pages.login.forgotPassword')}
        </Link>
      </aside>
    </section>
  )
}

export default Main
