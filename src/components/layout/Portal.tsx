import React, { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
}

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false)

  // Wait until after first render on client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent SSR mismatch
    return null
  }

  return createPortal(children, document.body)
}
