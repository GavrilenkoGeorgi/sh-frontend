import React, { type FC } from 'react'
import { Link } from 'react-router'

import LoginForm from '../components/forms/Login'
import * as styles from './Login.module.sass'
import { ROUTES } from '../constants/routes'
import { toPath } from '../utils'
import { useTranslation } from 'react-i18next'

const Login: FC = () => {
  const { t } = useTranslation()
  return (
    <section className={styles.container}>
      <h1>{t('ui.headings.login')}</h1>
      <LoginForm />
      <aside>
        <Link
          className={styles.link}
          to={toPath(ROUTES.FORGOT_PASSWORD)}
          viewTransition
          aria-label="Forgot password"
        >
          Forgot password?
        </Link>
      </aside>
    </section>
  )
}

export default Login
