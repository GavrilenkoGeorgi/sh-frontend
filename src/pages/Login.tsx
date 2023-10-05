import React, { type FC } from 'react'

import LoginForm from '../components/forms/Login'
import styles from './Login.module.sass'

const Login: FC = () => {
  return <section className={styles.container}>
    <h1>Login</h1>
    <LoginForm />
  </section>
}

export default Login
