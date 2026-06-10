import { type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ButtonIconProps {
  rollCount: number
  isLocked?: boolean
}

const trianglePath = 'M10 8 L10 8 L18 12 L10 16 Z'
const squarePath = 'M8 8 L16 8 L16 16 L8 16 Z'

const transformStyle = {
  transformBox: 'fill-box' as const,
  transformOrigin: 'center' as const
}

const defaultDuration = 0.4

export const PlayButtonIcon: FC<ButtonIconProps> = ({
  rollCount = 0,
  isLocked = false
}) => {
  const shouldPulse = !isLocked && rollCount === 0
  const iconPath = isLocked ? squarePath : trianglePath

  const pulseScale = shouldPulse ? [1, 1.08, 1] : 1
  const pulseTransition = shouldPulse
    ? { repeat: Infinity, duration: 2, ease: 'easeInOut' as const }
    : { duration: defaultDuration, ease: 'easeIn' as const }

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
            x1="7.1"
            y1="8"
            x2="7.1"
            y2="16"
            strokeWidth="1.5"
            style={transformStyle}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, scale: pulseScale }}
            exit={{ opacity: 0, y: 6 }}
            transition={{
              opacity: { duration: defaultDuration, ease: 'easeIn' },
              y: { duration: defaultDuration, ease: 'easeIn' },
              scale: pulseTransition
            }}
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
            style={transformStyle}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, scale: pulseScale }}
            exit={{ opacity: 0, y: 6 }}
            transition={{
              opacity: { duration: defaultDuration, ease: 'easeIn' },
              y: { duration: defaultDuration, ease: 'easeIn' },
              scale: pulseTransition
            }}
          />
        )}
      </AnimatePresence>
      <motion.path
        d={iconPath}
        style={transformStyle}
        animate={{
          d: iconPath
        }}
        transition={{
          d: { duration: defaultDuration + 0.2, ease: 'easeInOut' }
        }}
      />
    </svg>
  )
}
