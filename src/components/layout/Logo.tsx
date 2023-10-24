import React, { type FC } from 'react'
import { Link } from 'react-router-dom'

import styles from './Logo.module.sass'
import LogoSVG from '../../assets/svg/sharlushka-logo.svg'

const Logo: FC = () => {
  return <Link to="/" className={styles.logo} aria-label="Main page">
      <LogoSVG />
    </Link>
}

export default Logo
