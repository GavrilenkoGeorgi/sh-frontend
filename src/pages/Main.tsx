import React, { type FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

import LoginForm from '../components/forms/Login'
import * as styles from './Main.module.sass'
import { link } from './Login.module.sass'
import Logo from '../assets/svg/sharlushka-logo.svg'
import { ROUTES } from '../constants/routes'
import { selectIsAuthenticated } from '../store/slices/authSlice'

const Main: FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    if (isAuthenticated) navigate('/game')
  }, [isAuthenticated])

  return (
    <section className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <h1>Hi, Anonymous!</h1>
      <div className={styles.intro}>
        <p>
          You <Link to="/game">can play unregistered</Link>, but you will not be
          able to save the results or checkout other player&apos;s stats,
          consider <Link to="/register">registering</Link>.
        </p>
      </div>
      <LoginForm />
      <aside>
        <Link
          className={link}
          to={ROUTES.FORGOT_PASSWORD}
          aria-label="Forgot password"
        >
          Forgot password?
        </Link>
      </aside>
    </section>
  )
}

export default Main
