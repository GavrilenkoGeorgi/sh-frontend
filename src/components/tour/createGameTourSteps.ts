import { type Step } from 'react-joyride'
import { type TFunction } from 'i18next'

export const createGameTourSteps = (t: TFunction): Step[] => [
  {
    target: '[data-tour="score-display"]',
    content: t('tour.game.step1'),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '[data-tour="dice-controls"]',
    content: t('tour.game.step2'),
    placement: 'top'
  },
  {
    target: '[data-tour="score-board"]',
    content: t('tour.game.step3'),
    placement: 'top'
  },
  {
    target: '[data-tour="combination-poker"]',
    content: t('tour.game.step4'),
    placement: 'top'
  }
]
