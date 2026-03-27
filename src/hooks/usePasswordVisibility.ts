import { useCallback, useState } from 'react'

export function usePasswordVisibility() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])

  const hidePassword = useCallback(() => {
    setIsVisible(false)
  }, [])

  return {
    isVisible,
    toggleVisibility,
    hidePassword,
    inputType: isVisible ? 'text' : 'password'
  }
}
