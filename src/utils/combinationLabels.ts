import { type TFunction } from 'i18next'
import { type SaveScorePayload } from '../types'

// single source of truth for turning a combination key into a display label
export const getCombinationLabel = (
  category: SaveScorePayload,
  t: TFunction
): string => t(`combinations.${category}`)
