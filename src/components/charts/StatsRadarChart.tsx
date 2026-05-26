import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip
} from 'recharts'
import { FC } from 'react'
import { ChartAxisData } from '../../types'
import { chartColors } from './chartColors'
import { customTooltipRenderer } from './AreaChart'

const data = [
  {
    subject: 'Math',
    A: 120,
    B: 110,
    fullMark: 150
  }
]

export const StatsRadarChart: FC<{ data: ChartAxisData[] }> = ({ data }) => {
  console.log(data)
  return (
    <RadarChart
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '500px',
        maxHeight: '80vh',
        aspectRatio: 1.45
      }}
      responsive
      outerRadius="80%"
      data={data}
    >
      <PolarGrid />
      <PolarAngleAxis
        dataKey="id"
        style={{
          textTransform: 'capitalize'
        }}
        tick={{ fontSize: '0.8rem', fill: chartColors.primary }}
      />
      <PolarRadiusAxis
        stroke={chartColors.primary}
        axisLine={{
          strokeWidth: 0.5,
          strokeDasharray: '4 4'
        }}
        angle={120}
        tick={{ dx: 5, fontSize: '0.8rem', fill: chartColors.primary }}
      />
      <Radar
        name="Favourite Dice Values"
        dataKey="value"
        stroke={chartColors.primary}
        fill={chartColors.primaryMuted}
        fillOpacity={0.6}
      />
      <Tooltip content={customTooltipRenderer} />
    </RadarChart>
  )
}
