import { useState, useLayoutEffect, useEffect, useCallback } from 'react'

export type ThemeMode = 'system' | 'dark' | 'light'

const STORAGE_KEY = 'color-scheme'
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

// cycle order: system → dark → light → system
const nextMode: Record<ThemeMode, ThemeMode> = {
  system: 'dark',
  dark: 'light',
  light: 'system'
}

function getStoredMode(): ThemeMode {
  const value = localStorage.getItem(STORAGE_KEY)
  if (value === 'dark' || value === 'light' || value === 'system') return value
  return 'system'
}

function applyMode(mode: ThemeMode): void {
  if (mode === 'system') {
    delete document.documentElement.dataset.colorScheme
  } else {
    document.documentElement.dataset.colorScheme = mode
  }
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return mediaQuery.matches
}

export function useColorScheme() {
  const [mode, setMode] = useState<ThemeMode>(getStoredMode)
  const [isDark, setIsDark] = useState(() => resolveIsDark(getStoredMode()))

  useLayoutEffect(() => {
    applyMode(mode)
  }, [])

  // keep effective theme in sync when OS preference changes in system mode
  useEffect(() => {
    const handleChange = (event: MediaQueryListEvent): void => {
      if (mode === 'system') {
        setIsDark(event.matches)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode])

  const toggleColorScheme = useCallback(() => {
    setMode((prev) => {
      const next = nextMode[prev]
      applyMode(next)
      localStorage.setItem(STORAGE_KEY, next)
      setIsDark(resolveIsDark(next))
      return next
    })
  }, [])

  return { isDark, mode, toggleColorScheme }
}
