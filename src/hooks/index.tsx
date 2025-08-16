import { useEffect, useState, useRef } from 'react'

export enum SCROLL_DIRECTION {
  UP = 'up',
  DOWN = 'down'
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('')

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction =
        scrollY > lastScrollY ? SCROLL_DIRECTION.DOWN : SCROLL_DIRECTION.UP
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction)
      }
      lastScrollY = scrollY > 0 ? scrollY : 0
    }
    window.addEventListener('scroll', updateScrollDirection)
    return () => {
      window.removeEventListener('scroll', updateScrollDirection)
    }
  }, [scrollDirection])

  return scrollDirection
}

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

export const useNextImageImageFade = (_className: string) => {
  // tf is this?
  const [className, setClassName] = useState(`${_className} opacity-0`)
  return {
    className,
    onLoad: () => {
      setClassName(`${_className} opacity-1`)
    }
  }
}

// export new dice board hooks
export { useDiceBoard } from './useDiceBoard'
export { useDragHandlers } from './useDragHandlers'
