import React, { type FC } from 'react'

import RegisterForm from '../components/forms/Register'
import styles from './Register.module.sass'

const Register: FC = () => {
  return <section className={styles.container}>
    <h1>Register</h1>
    <RegisterForm />
  </section>
}

export default Register
