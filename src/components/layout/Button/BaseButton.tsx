import React from 'react'
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps
} from 'react-aria-components'
import * as styles from './BaseButton.module.sass'

interface ButtonProps extends RACButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md'
  isLoading?: boolean
  children?: React.ReactNode
}

// A minimal inline SVG spinner
const Spinner = () => (
  <svg
    className={styles.spinner}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true" // Screen readers will just hear "Loading..." from the button text
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

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
          <Spinner />
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
