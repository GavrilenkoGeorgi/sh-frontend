import React, { type FC } from 'react'

interface ButtonIconProps {
  rollCount?: number
}

export const PlayButtonIcon: FC<ButtonIconProps> = ({ rollCount = 0 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {rollCount === 0 && <line x1="6" y1="8" x2="6" y2="16" />}
      {rollCount <= 1 && <line x1="8" y1="8" x2="8" y2="16" />}
      <polygon points="10 8 18 12 10 16" />
    </svg>
  )
}
