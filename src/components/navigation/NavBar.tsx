import React, { type FC, useState, useEffect } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import type { navLink } from '../../types'
import { useScrollDirection, useComponentVisible } from '../../hooks'

import Logo from '../layout/Logo'
import { MenuToggleBtn } from './MenuToggleBtn'
import styles from './NavBar.module.sass'

const NavBar: FC = () => {

  const { userInfo } = useSelector((state: RootState) => state.auth)
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
      label: 'Game',
      url: '/game'
    },
    {
      label: 'Profile',
      url: '/profile'
    },
    {
      label: 'Login',
      url: '/login'
    },
    {
      label: 'Stats',
      url: '/stats'
    },
    {
      label: 'Register',
      url: '/register'
    },
    {
      label: 'Help',
      url: '/help'
    }
  ]

  const navLinks = navigation.map(link =>
    <NavLink to={link.url}
      key={link.url}
      className={({ isActive }) => isActive
        ? `${styles.navLink} ${styles.current}`
        : styles.navLink
       }
    >
      {link.label}
    </NavLink>
  )

  const navbarStyle = `${styles.nav} ${scrollDirection === 'down' ? styles.hiddenNav : styles.visibleNav}` // cx??

  return <>
    <nav className={navbarStyle} ref={ref}>
      <div className={styles.navigationContainer}>
        <Logo />
        <Link to="/stats" className={styles.userName}>
          {userInfo?.name}
        </Link>
        <div
          className={styles.toggleBtnContainer}
          onClick={toggleMenu}
        >
          <MenuToggleBtn open={open} />
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
