import React, { type FC, useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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
    setOpen((prevState) => {
      return prevState && false
    })
  }, [scrollDirection])

  const navigation: navLink[] = [
    {
      label: 'Game',
      url: ROUTES.GAME
    },
    {
      label: 'Profile',
      url: ROUTES.PROFILE
    },
    {
      label: 'Login',
      url: ROUTES.LOGIN
    },
    {
      label: 'Stats',
      url: ROUTES.STATS
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
  ]

  const navLinks = navigation.map((link) => (
    <NavLink
      to={link.url}
      key={link.url}
      className={({ isActive }) =>
        cx(styles.navLink, {
          [styles.current]: isActive
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
        <div className={styles.toggleBtnContainer} onClick={toggleMenu}>
          <MenuToggleBtn open={open} />
        </div>
        <div
          className={cx(styles.linksContainer, {
            [styles.open]: open
          })}
        >
          <UserLink />
          {navLinks}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
