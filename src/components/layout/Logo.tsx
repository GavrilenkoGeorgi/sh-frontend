import React, { type FC } from 'react'
import { Link } from 'react-router-dom'

import styles from './Logo.module.sass'

const Logo: FC = () => {
  return <Link to="/" className={styles.logo} aria-label="Main page">
    <svg version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 5 49 39">
      <path fill="#F3E5F5" d="M18.6,42.845H2.4c-1.325,0-2.4-1.074-2.4-2.4v-16.2c0-1.325,1.074-2.4,2.4-2.4h16.2
        c1.325,0,2.4,1.074,2.4,2.4v16.2C21,41.77,19.926,42.845,18.6,42.845z"/>
      <circle fill="#AB47BC" cx="5" cy="26.845" r="2"/>
      <circle fill="#AB47BC" cx="16" cy="26.845" r="2"/>
      <circle fill="#AB47BC" cx="5" cy="37.845" r="2"/>
      <circle fill="#AB47BC" cx="16" cy="37.845" r="2"/>
      <circle fill="#AB47BC" cx="10.5" cy="32.678" r="2"/>
      <path fill="#AB47BC" d="M46.734,25.466l-15.299,5.327c-1.252,0.436-2.62-0.226-3.056-1.477l-5.327-15.299
        c-0.436-1.252,0.226-2.62,1.477-3.056l15.299-5.327c1.252-0.436,2.62,0.226,3.056,1.477l5.327,15.299
        C48.647,23.662,47.985,25.03,46.734,25.466z"/>
      <circle fill="#F3E5F5" cx="28.628" cy="14.828" r="2"/>
      <circle fill="#F3E5F5" cx="39.017" cy="11.211" r="2"/>
      <circle fill="#F3E5F5" cx="32.246" cy="25.217" r="2"/>
      <circle fill="#F3E5F5" cx="42.634" cy="21.599" r="2"/>
    </svg>
  </Link>
}

export default Logo
