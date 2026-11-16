import { useEffect, useState, useRef } from 'react'

export function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const ref = useRef<HTMLInputElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      ref.current &&
      !ref.current.contains(event.target as HTMLInputElement)
    ) {
      setIsComponentVisible(false)
    } else {
      setIsComponentVisible(true)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return { ref, isComponentVisible, setIsComponentVisible }
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    setMatches(mediaQueryList.matches)

    const handleChange = (event: MediaQueryListEvent) =>
      setMatches(event.matches)
    mediaQueryList.addEventListener('change', handleChange)
    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

// export new dice board hooks
export { useDiceBoard } from './useDiceBoard'
export { useDragHandlers } from './useDragHandlers'
export { useFormFocus } from './useFormFocus'
