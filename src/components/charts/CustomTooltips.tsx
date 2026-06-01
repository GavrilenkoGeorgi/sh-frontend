import { ReactNode } from 'react'
import { type TooltipContentProps } from 'recharts'
import * as styles from './Charts.module.sass'

export const AreaCustomTooltipRenderer = ({
  active,
  payload
}: TooltipContentProps): ReactNode => {
  if (!active || !payload?.length) return null

  const { payload: tooltip, value } = payload[0]

  return (
    <div className={styles.customTooltip}>
      <p className={styles.tooltipLabel}>{tooltip.id}</p>
      <p className={styles.tooltipValue}>{value}</p>
    </div>
  )
}

export const RadarCustomTooltipRenderer = ({
  active,
  payload
}: TooltipContentProps): ReactNode => {
  if (!active || !payload?.length) return null

  const { payload: tooltip, value } = payload[0]

  return (
    <div className={styles.customTooltip}>
      <p className={styles.tooltipLabel}>{tooltip.id}</p>
      <p className={styles.tooltipValue}>{value}%</p>
    </div>
  )
}
