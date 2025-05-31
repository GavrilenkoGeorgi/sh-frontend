import React, { type FC } from 'react'
import { Link } from 'react-router-dom'

import LoginForm from '../components/forms/Login'
import * as styles from './Login.module.sass'

const Login: FC = () => {
  return (
    <section className={styles.container}>
      <h1>Login</h1>
      <LoginForm />
      <aside>
        <Link to="/forgotpwd" aria-label="Forgot password">
          Forgot password?
        </Link>
      </aside>
    </section>
  )
}

export default Login
