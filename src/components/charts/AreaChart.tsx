import { type FC, type ReactNode } from 'react'
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  type TooltipContentProps
} from 'recharts'

import { type ChartProps } from '../../types'

import * as styles from './Charts.module.sass'
import { tickStyles } from './BarChart'
import { chartColors } from './chartColors'

function customTooltipRenderer({
  active,
  payload,
  label
}: TooltipContentProps): ReactNode {
  if (!active || !payload?.length) return null

  return (
    <div className={styles.customTooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>{payload[0].value}</p>
    </div>
  )
}

const Chart: FC<ChartProps> = ({ data, syncId, referenceValue }) => {
  const margin = {
    top: 10,
    right: 30,
    left: -10,
    bottom: 10
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      initialDimension={{ width: 100, height: 50 }}
    >
      <AreaChart
        data={data}
        margin={margin}
        width={500}
        height={300}
        syncId={syncId}
      >
        <defs>
          <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartColors.primary}
              stopOpacity={0.7}
            />
            <stop
              offset="95%"
              stopColor={chartColors.primaryMuted}
              stopOpacity={0}
            />
          </linearGradient>
          <filter id="areaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="4 6" strokeWidth={0.5} />
        <XAxis dataKey="id" hide />
        <YAxis
          tickCount={4}
          tickSize={0}
          tickMargin={10}
          axisLine={false}
          style={tickStyles}
        />
        <Tooltip content={customTooltipRenderer} />
        {referenceValue !== undefined && (
          <ReferenceLine
            y={referenceValue}
            stroke={chartColors.primaryMuted}
            strokeDasharray="6 4"
            strokeWidth={1}
          />
        )}
        <Area
          type="natural"
          dataKey="value"
          stroke={chartColors.primary}
          strokeWidth={1}
          fill="url(#areaColor)"
          filter="url(#areaGlow)"
          activeDot={{
            r: 5,
            fill: chartColors.primary,
            stroke: chartColors.primaryLight,
            strokeWidth: 1
          }}
          animationDuration={2000}
          animationBegin={250}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default Chart
