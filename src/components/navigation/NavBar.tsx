import React, { type FC, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { navLink } from '../../types'
import { useScrollDirection, useComponentVisible } from '../../hooks'

import Logo from '../layout/Logo'
import { MenuToggleBtn } from './MenuToggleBtn'
import styles from './NavBar.module.sass'

const NavBar: FC = () => {

  const location = useLocation()
  const scrollDirection = useScrollDirection()

  // mobile menu
  const { ref, isComponentVisible } = useComponentVisible(false)
  const [open, setOpen] = useState(false)

  const toggleMenu = (): void => {
    setOpen(!open)
  }

  // hide on route change
  useEffect(() => {
    setOpen(false)
  }, [location])

  // hide on outside click
  useEffect(() => {
    if (!isComponentVisible) setOpen(false)
  }, [isComponentVisible])

  // close mobile menu and hide overlay on scroll
  useEffect(() => {
    setOpen(prevState => {
      return prevState && false
    })
  }, [scrollDirection])

  const navigation: navLink[] = [
    {
      label: 'Register',
      url: '/register'
    },
    {
      label: 'Login',
      url: '/login'
    },
    {
      label: 'Logout',
      url: '/logout'
    },
    {
      label: 'Game',
      url: '/game'
    },
    {
      label: 'Profile',
      url: '/profile'
    },
    {
      label: 'Stats',
      url: '/stats'
    }
  ]

  const navLinks = navigation.map(link =>
    <Link to={link.url}
      key={link.url}
      /* scroll={false} */
    >
      {/* <button className={router.pathname === link.url
        ? `${styles.navLink} ${styles.current}`
        : styles.navLink}
      > */}
        {link.label}
      {/* </button> */}
    </Link>
  )

  const navbarStyle = `${styles.nav} ${scrollDirection === 'down' ? styles.hiddenNav : styles.visibleNav}`

  return <>
    <nav className={navbarStyle} ref={ref}>
      <div className={styles.navigationContainer}>
        <Logo />
        <div
          className={styles.toggleBtnContainer}
          onClick={toggleMenu}
        >
          <MenuToggleBtn open={open}/>
        </div>
        <div
          className={`${styles.linksContainer} ${open && styles.open}`}
        >
          {navLinks}
        </div>
      </div>
    </nav>
    <div className={`${styles.overlay} ${open ? styles.openOverlay : ''}`}>
    </div>
  </>
}

export default NavBar
