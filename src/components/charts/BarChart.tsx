import { type FC } from 'react'
import {
  BarChart,
  XAxis,
  Bar,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

import { type ChartProps } from '../../types'

import { chartColors } from './chartColors'

export const tickStyles = {
  fontSize: '.8rem',
  fill: chartColors.primary
}

const Chart: FC<ChartProps> = ({ data }) => {
  const margin = {
    top: 0,
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
      <BarChart data={data} margin={margin}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.primary} stopOpacity={1} />
            <stop
              offset="100%"
              stopColor={chartColors.primaryMuted}
              stopOpacity={0.6}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="4 6"
          strokeWidth={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="id"
          tickSize={0}
          tickMargin={10}
          axisLine={false}
          style={tickStyles}
        />
        <YAxis
          tickCount={3}
          tickSize={0}
          tickMargin={10}
          axisLine={false}
          style={tickStyles}
          domain={[0, 100]}
        />
        <Bar
          dataKey="value"
          fill="url(#barGradient)"
          maxBarSize={18}
          radius={[4, 4, 0, 0]}
          animationDuration={4000}
          animationBegin={500}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart
