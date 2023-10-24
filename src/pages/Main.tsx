import React, { type FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import RegisterForm from '../components/forms/Register'
import styles from './Main.module.sass'
import Logo from '../assets/svg/sharlushka-logo.svg'

const Main: FC = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const auth = Boolean(localStorage.getItem('accessToken'))
    if (auth) navigate('/game')
  }, [])

  return <section className={styles.container}>
    <div className={styles.logo}>
      <Logo />
    </div>
    <h1>Hi, Anonymous!</h1>
    <div className={styles.ctaContainer}>
      <p>
        You <Link to="/game">can play unregistered</Link>, but you will not
        be able to save the results or checkout other player&apos;s stats,
        consider registering.
      </p>
    </div>
    <RegisterForm />
  </section>
}

export default Main
