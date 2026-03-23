import React, { type FC, useState, useEffect, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { navLink } from '../../types'
import {
  useScrollDirection,
  useComponentVisible,
  SCROLL_DIRECTION
} from '../../hooks'
import cx from 'classnames'

import Logo from '../layout/Logo'
import { MenuToggleBtn } from './MenuToggleBtn'
import * as styles from './NavBar.module.sass'

import { ROUTES } from '../../constants/routes'
import { ScoreDisplay } from '../game/ScoreDisplay'
import { UserLink } from './UserLink'
import { selectIsAuthenticated } from '../../store/slices/authSlice'
import { useColorScheme } from '../../hooks/useColorScheme'
import { ThemeToggle } from '../layout/ThemeToggle'

const NavBar: FC = () => {
  const location = useLocation()
  const scrollDirection = useScrollDirection()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // mobile menu
  const { ref, isComponentVisible } = useComponentVisible(false)
  const [open, setOpen] = useState(false)
  const { isDark, toggleColorScheme } = useColorScheme()

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

  const navigation: navLink[] = useMemo(
    () => [
      {
        label: 'Game',
        url: ROUTES.GAME
      },
      {
        label: 'Profile',
        url: ROUTES.PROFILE,
        disabled: !isAuthenticated
      },
      {
        label: `${!isAuthenticated ? 'Login' : 'Logout'}`,
        url: ROUTES.LOGIN
      },
      {
        label: 'Stats',
        url: ROUTES.STATS,
        disabled: !isAuthenticated
      },
      {
        label: 'Register',
        url: ROUTES.REGISTER
      },
      {
        label: 'Privacy',
        url: ROUTES.PRIVACY
      },
      {
        label: 'Help',
        url: ROUTES.HELP
      }
    ],
    [isAuthenticated]
  )

  const navLinks = navigation.map((link) => (
    <NavLink
      to={link.url}
      key={link.url}
      aria-disabled={link.disabled ? 'true' : 'false'}
      className={({ isActive }) =>
        cx(styles.navLink, {
          [styles.current]: isActive,
          [styles.disabled]: link.disabled
        })
      }
    >
      {link.label}
    </NavLink>
  ))

  return (
    <nav
      className={cx(styles.nav, {
        [styles.hiddenNav]: scrollDirection === SCROLL_DIRECTION.DOWN,
        [styles.visibleNav]: scrollDirection !== SCROLL_DIRECTION.DOWN
      })}
      ref={ref}
    >
      <div className={styles.navigationContainer}>
        <Logo />
        <ScoreDisplay />
        <div className={styles.toggleBtnContainer}>
          <ThemeToggle toggle={isDark} onClick={toggleColorScheme} />
          <MenuToggleBtn open={open} onClick={toggleMenu} />
        </div>
        <div
          className={cx(styles.linksContainer, {
            [styles.open]: open
          })}
        >
          {isAuthenticated && <UserLink />}
          {navLinks}
          <p className={styles.version}>v{__APP_VERSION__}</p>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
