import React from 'react'
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps
} from 'react-aria-components'
import * as styles from './BaseButton.module.sass'
import LoadingIndicator from '../LoadingIndicator'

interface ButtonProps extends RACButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md'
  isLoading?: boolean
  children?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  isDisabled,
  ...props
}: ButtonProps) {
  // Combine standard classes.
  // RAC will automatically add data-hovered, data-pressed, etc. to the DOM node.
  const combinedClassName = [
    styles.button,
    styles[variant],
    styles[size],
    // Allow custom classes to be passed in from the parent if needed
    typeof className === 'string' ? className : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <RACButton
      className={combinedClassName}
      // Force disable if loading to prevent double-clicks
      isDisabled={isLoading || isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingIndicator />
          {/* Optional: keep children visible but slightly dimmed alongside the spinner, 
              or replace text entirely. Keeping them side-by-side prevents button resizing. */}
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </RACButton>
  )
}
