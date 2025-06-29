import React, { type FC, useState, useEffect } from 'react'
import { NavLink, useLocation, Link } from 'react-router'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import type { navLink } from '../../types'
import { useScrollDirection, useComponentVisible } from '../../hooks'

import Logo from '../layout/Logo'
import { MenuToggleBtn } from './MenuToggleBtn'
import * as styles from './NavBar.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'
import UserIcon from '../../assets/svg/icon-user.svg'

const NavBar: FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { busy } = useSelector((state: RootState) => state.notification)
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
    setOpen((prevState) => {
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
      label: 'Privacy',
      url: '/privacy'
    },
    {
      label: 'Help',
      url: '/help'
    }
  ]

  const navLinks = navigation.map((link) => (
    <NavLink
      to={link.url}
      key={link.url}
      className={({ isActive }) =>
        isActive ? `${styles.navLink} ${styles.current}` : styles.navLink
      }
    >
      {link.label}
    </NavLink>
  ))

  const navbarStyle = `${styles.nav} ${
    scrollDirection === 'down' ? styles.hiddenNav : styles.visibleNav
  }` // cx??

  return (
    <>
      <nav className={navbarStyle} ref={ref}>
        <div className={styles.navigationContainer}>
          <Logo />
          <div className={styles.user}>
            <Link
              to={userInfo != null ? '/profile' : '/login'}
              className={styles.userName}
              aria-label={userInfo?.name ?? 'Guest'}
            >
              <UserIcon />
            </Link>
            {userInfo != null && (
              <Link
                to="/stats"
                className={styles.userName}
                aria-label={userInfo.name}
              >
                {userInfo.name}
              </Link>
            )}
            {busy && <LoadingIndicator dark />}
          </div>
          <div className={styles.toggleBtnContainer} onClick={toggleMenu}>
            <MenuToggleBtn open={open} />
          </div>
          <div className={`${styles.linksContainer} ${open && styles.open}`}>
            {navLinks}
          </div>
        </div>
      </nav>
      {/* <div
        className={`${styles.overlay} ${open ? styles.openOverlay : ''}`}
      ></div> */}
    </>
  )
}

export default NavBar
