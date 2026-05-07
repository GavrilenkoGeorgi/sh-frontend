import React, { type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
      aria-hidden="true"
      focusable="false"
    >
      <AnimatePresence>
        {rollCount <= 1 && (
          <motion.line
            key="line-mid"
            x1="8"
            y1="8"
            x2="8"
            y2="16"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        )}
        {rollCount === 0 && (
          <motion.line
            key="line-left"
            x1="6"
            y1="8"
            x2="6"
            y2="16"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ delay: 0.12, duration: 0.2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <motion.polygon
        points="10 8 18 12 10 16"
        animate={rollCount === 0 ? 'idle' : 'still'}
        variants={{
          idle: {
            scale: [1, 1.08, 1],
            transition: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }
          },
          still: { scale: 1 }
        }}
        style={{ transformOrigin: '14px 12px' }}
      />
    </svg>
  )
}
