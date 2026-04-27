import { type FC, type ReactNode, useRef } from 'react'

import { PlayButtonIcon } from './PlayButtonIcon'

const MAX_ROLLS = 3
type VibrateFn = (pattern: number | number[]) => boolean

interface RollActionButtonProps {
  rollCount: number
  isLocked: boolean
  onRoll: () => void
  onLockedPress?: () => void
  lockedIcon?: ReactNode
  cooldownMs?: number
  className?: string
}

const RollActionButton: FC<RollActionButtonProps> = ({
  rollCount,
  isLocked,
  onRoll,
  onLockedPress,
  lockedIcon,
  cooldownMs = 500,
  className
}) => {
  const lastAcceptedClickRef = useRef(0)

  const handleClick = (): void => {
    const now = Date.now()
    if (now - lastAcceptedClickRef.current < cooldownMs) return
    lastAcceptedClickRef.current = now

    const noRollsLeft = isLocked || rollCount >= MAX_ROLLS
    if (noRollsLeft) {
      if (typeof navigator !== 'undefined') {
        const vibrate = (navigator as { vibrate?: VibrateFn }).vibrate
        if (typeof vibrate === 'function') {
          vibrate.call(navigator, 40)
        }
      }
      onLockedPress?.()
      return
    }

    onRoll()
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {isLocked && lockedIcon ? lockedIcon : <PlayButtonIcon rollCount={rollCount} />}
    </button>
  )
}

export default RollActionButton
