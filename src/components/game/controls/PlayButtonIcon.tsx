import { type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ButtonIconProps {
  rollCount: number
  isLocked?: boolean
}

const trianglePath = 'M10 8 L10 8 L18 12 L10 16 Z'
const squarePath = 'M8 8 L16 8 L16 16 L8 16 Z'

export const PlayButtonIcon: FC<ButtonIconProps> = ({
  rollCount = 0,
  isLocked = false
}) => {
  const shouldPulse = !isLocked && rollCount === 0
  const iconPath = isLocked ? squarePath : trianglePath

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <AnimatePresence>
        {rollCount <= 1 && !isLocked && (
          <motion.line
            key="line-mid"
            x1="7"
            y1="8"
            x2="7"
            y2="16"
            strokeWidth="1.5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.4, ease: 'easeIn' }}
          />
        )}
        {rollCount === 0 && !isLocked && (
          <motion.line
            key="line-left"
            x1="4"
            y1="8"
            x2="4"
            y2="16"
            strokeWidth="1.5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>
      <motion.path
        d={iconPath}
        initial={false}
        animate={{
          d: iconPath,
          scale: shouldPulse ? [1, 1.08, 1] : 1
        }}
        transition={{
          d: { duration: 0.5, ease: 'easeInOut' },
          scale: shouldPulse
            ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
            : { duration: 0.5, ease: 'easeInOut' }
        }}
      />
    </svg>
  )
}
