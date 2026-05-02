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

import { tickStyles } from './BarChart'
import { chartColors } from './chartColors'

const Chart: FC<ChartProps> = ({ data }) => {
  const margin = {
    top: 10,
    right: 30,
    left: 10,
    bottom: 10
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      initialDimension={{ width: 100, height: 50 }}
    >
      <BarChart data={data} margin={margin} layout="vertical">
        <defs>
          <linearGradient id="vertBarGradient" x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0%"
              stopColor={chartColors.primaryMuted}
              stopOpacity={0.6}
            />
            <stop
              offset="100%"
              stopColor={chartColors.primary}
              stopOpacity={1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="4 6"
          strokeWidth={0.6}
          horizontal={false}
        />
        <XAxis
          type="number"
          tickSize={0}
          tickMargin={10}
          tickCount={7}
          axisLine={false}
          style={tickStyles}
          domain={[0, 100]}
        />
        <YAxis
          type="category"
          dataKey="id"
          tickSize={0}
          tickMargin={10}
          axisLine={false}
          style={tickStyles}
        />
        <Bar
          dataKey="value"
          fill="url(#vertBarGradient)"
          maxBarSize={18}
          radius={[0, 4, 4, 0]}
          animationDuration={4000}
          animationBegin={500}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart
