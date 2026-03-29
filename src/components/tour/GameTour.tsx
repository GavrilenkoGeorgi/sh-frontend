import React, { type FC, useCallback, useEffect, useState } from 'react'
import { Joyride, type EventData, STATUS } from 'react-joyride'
import { useTranslation } from 'react-i18next'

import { createGameTourSteps } from './createGameTourSteps'
import { useGameTour } from '../../hooks/useGameTour'
import * as styles from './GameTour.module.sass'

const TOUR_TARGETS = [
  '[data-tour="score-display"]',
  '[data-tour="dice-controls"]',
  '[data-tour="score-board"]',
  '[data-tour="combination-poker"]'
]

// check that all target elements are present in the DOM
const allTargetsMounted = (): boolean =>
  TOUR_TARGETS.every((selector) => document.querySelector(selector) !== null)

const GameTour: FC = () => {
  const { t } = useTranslation()
  const { hasSeenGameTour, markGameTourSeen } = useGameTour()
  const [run, setRun] = useState(false)
  const steps = createGameTourSteps(t)

  // wait for all targets to mount before starting
  useEffect(() => {
    if (hasSeenGameTour) return

    const check = (): void => {
      if (allTargetsMounted()) {
        setRun(true)
      }
    }

    // try immediately, then poll briefly
    check()
    const interval = setInterval(check, 300)
    const timeout = setTimeout(() => clearInterval(interval), 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [hasSeenGameTour])

  const handleEvent = useCallback(
    (data: EventData) => {
      const { status } = data
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        setRun(false)
        markGameTourSeen()
      }
    },
    [markGameTourSeen]
  )

  if (hasSeenGameTour) return null

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      locale={{
        next: t('tour.actions.next'),
        back: t('tour.actions.back'),
        skip: t('tour.actions.skip'),
        last: t('tour.actions.done')
      }}
      options={{
        zIndex: 10000,
        spotlightPadding: 4,
        overlayClickAction: false,
        buttons: ['skip', 'back', 'close', 'primary']
      }}
      onEvent={handleEvent}
      styles={{
        tooltip: {
          width: '300px'
        },
        tooltipContent: {
          textAlign: 'left'
        }
      }}
    />
  )
}

export default GameTour
