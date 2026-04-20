import { type FC, useState, useEffect, useMemo } from 'react'
import { NavLink, useLocation, useMatch } from 'react-router' //dom?
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
import TurnDisplay from '../../features/multiplayer/components/TurnDisplay'
import { useTranslation } from 'react-i18next'

const NavBar: FC = () => {
  const location = useLocation()
  const playRoute = useMatch(ROUTES.PLAY)
  const multiplayerRoute = useMatch(ROUTES.MULTIPLAYER)
  const scrollDirection = useScrollDirection()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { t } = useTranslation()

  const { ref, isComponentVisible } = useComponentVisible(false)
  const [open, setOpen] = useState(false)
  const { isDark, mode, toggleColorScheme } = useColorScheme()

  const toggleMenu = (): void => {
    setOpen((prev) => !prev)
  }

  const closeMenu = (): void => {
    setOpen(false)
  }

  useEffect(() => {
    if (open) closeMenu()
  }, [location.pathname])

  useEffect(() => {
    if (open && !isComponentVisible) closeMenu()
  }, [isComponentVisible, open])

  useEffect(() => {
    if (open) closeMenu()
  }, [scrollDirection])

  const navigation: navLink[] = useMemo(
    () => [
      { label: t('ui.navLinks.play'), url: ROUTES.PLAY },
      {
        label: t('ui.navLinks.stats'),
        url: ROUTES.STATS,
        disabled: !isAuthenticated
      },
      {
        label: t('ui.navLinks.profile'),
        url: ROUTES.PROFILE,
        disabled: !isAuthenticated
      },
      {
        label: t('ui.navLinks.multiplayer'),
        url: ROUTES.MULTIPLAYER,
        disabled: !isAuthenticated
      },
      {
        label: t('ui.navLinks.register'),
        url: ROUTES.REGISTER,
        disabled: isAuthenticated
      },
      { label: t('ui.navLinks.privacy'), url: ROUTES.PRIVACY },
      { label: t('ui.navLinks.help'), url: ROUTES.HELP }
    ],
    [isAuthenticated]
  )

  const navLinks = navigation.map((link) => (
    <NavLink
      to={link.url}
      key={link.url}
      viewTransition
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
    <>
      <nav
        className={cx(styles.nav, {
          [styles.hiddenNav]: scrollDirection === SCROLL_DIRECTION.DOWN,
          [styles.visibleNav]: scrollDirection !== SCROLL_DIRECTION.DOWN
        })}
        ref={ref}
      >
        <div className={styles.navigationContainer}>
          <Logo />
          {playRoute && <ScoreDisplay />}
          {multiplayerRoute && <TurnDisplay />}

          <div className={styles.toggleBtnContainer}>
            <ThemeToggle
              isDark={isDark}
              mode={mode}
              onClick={toggleColorScheme}
            />
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
      <div
        className={cx(styles.backdrop, {
          [styles.backdropOpen]: open
        })}
        onClick={closeMenu}
      />
    </>
  )
}

export default NavBar
