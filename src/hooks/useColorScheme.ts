import { useState, useLayoutEffect, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'color-scheme'
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function getStoredScheme(): 'dark' | 'light' | null {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'dark' || value === 'light' ? value : null
}

export function useColorScheme() {
  const [isDark, setIsDark] = useState(
    () =>
      getStoredScheme() === 'dark' ||
      (getStoredScheme() === null && mediaQuery.matches)
  )

  useLayoutEffect(() => {
    // only pin the attribute when the user explicitly chose a scheme;
    // without a stored preference, the CSS @media rule handles it automatically
    const stored = getStoredScheme()
    if (stored !== null) {
      document.documentElement.dataset.colorScheme = stored
    }
  }, [])

  useEffect(() => {
    // keep the toggle icon in sync when the OS preference changes,
    // but only when the user hasn't pinned a scheme manually
    const handleChange = (event: MediaQueryListEvent): void => {
      if (getStoredScheme() === null) {
        setIsDark(event.matches)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleColorScheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.dataset.colorScheme = next ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      return next
    })
  }, [])

  return { isDark, toggleColorScheme }
}
