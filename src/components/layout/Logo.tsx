import React, { type FC } from 'react'
import { Link } from 'react-router'

import LogoSVG from '../../assets/svg/sharlushka-logo.svg'
import * as styles from './Logo.module.sass'

const Logo: FC = () => {
  return (
    <div className={styles.logoContainer}>
      <Link to="/" className={styles.logo} aria-label="Main page">
        <LogoSVG />
      </Link>
    </div>
  )
}

export default Logo
