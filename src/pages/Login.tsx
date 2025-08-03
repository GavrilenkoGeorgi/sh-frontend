import React, { type FC } from 'react'
import { Link } from 'react-router'

import LoginForm from '../components/forms/Login'
import * as styles from './Login.module.sass'
import { ROUTES } from '../constants/routes'

const Login: FC = () => {
  return (
    <section className={styles.container}>
      <h1>Login</h1>
      <LoginForm />
      <aside>
        <Link to={ROUTES.FORGOT_PASSWORD} aria-label="Forgot password">
          Forgot password?
        </Link>
      </aside>
    </section>
  )
}

export default Login
