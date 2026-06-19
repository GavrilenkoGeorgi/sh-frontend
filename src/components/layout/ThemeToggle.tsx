import type { ThemeMode } from '../../hooks/useColorScheme'
import { useTranslation } from 'react-i18next'
import * as styles from './ThemeToggle.module.sass'
import { Button } from './Button/BaseButton'

export const ThemeToggle = ({
  isDark,
  mode,
  onClick
}: {
  isDark: boolean
  mode: ThemeMode
  onClick: () => void
}) => {
  const { t } = useTranslation()
  const label = t(`ui.theme.${mode}`)

  return (
    <div className={styles.themeToggleContainer}>
      <Button
        className={`theme-toggle ${mode !== 'system' && isDark ? 'theme-toggle--toggled' : ''}`}
        aria-label={label}
        onClick={onClick}
        variant="invisible"
        size="tiny"
      >
        {mode === 'system' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            width="25"
            height="25"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M9.5 22H14.5M10 10H14M12 10L12 16M15 15.3264C17.3649 14.2029 19 11.7924 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 11.7924 6.63505 14.2029 9 15.3264V16C9 16.9319 9 17.3978 9.15224 17.7654C9.35523 18.2554 9.74458 18.6448 10.2346 18.8478C10.6022 19 11.0681 19 12 19C12.9319 19 13.3978 19 13.7654 18.8478C14.2554 18.6448 14.6448 18.2554 14.8478 17.7654C15 17.3978 15 16.9319 15 16V15.3264Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            width="25"
            height="25"
            fill="currentColor"
            className="theme-toggle__expand"
            viewBox="0 0 32 32"
          >
            <clipPath id="theme-toggle__expand__cutout">
              <path d="M0-11h25a1 1 0 0017 13v30H0Z" />
            </clipPath>
            <g clipPath="url(#theme-toggle__expand__cutout)">
              <circle cx="16" cy="16" r="8.4" />
              <path d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z" />
            </g>
          </svg>
        )}
      </Button>
    </div>
  )
}
