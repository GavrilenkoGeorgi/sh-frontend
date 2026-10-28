import { useEffect, useState } from 'react'
import { DESKTOP_BREAKPOINT_PX } from '../constants/layout'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth < DESKTOP_BREAKPOINT_PX
      : false
  )

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT_PX)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}
