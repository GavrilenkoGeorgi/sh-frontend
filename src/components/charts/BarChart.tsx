import React, { type FC } from 'react'
import {
  BarChart,
  XAxis,
  Bar,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

import { type ChartProps } from '../../types'

export const tickStyles = {
  fontSize: '.8rem',
  fill: '#AB47BC'
}

const Chart: FC<ChartProps> = ({ data }) => {

  const margin = {
    top: 0,
    right: 30,
    left: -10,
    bottom: 10
  }

  return <ResponsiveContainer>
    <BarChart
      data={data}
      margin={margin}
    >
      <CartesianGrid
        strokeDasharray='4 6'
        strokeWidth={0.6}
        vertical={false}
      />
      <XAxis
        dataKey='id'
        tickSize={0}
        tickMargin={10}
        axisLine={false}
        style={tickStyles}
      />
      <YAxis
        tickCount={4}
        color='red'
        tickSize={0}
        tickMargin={10}
        axisLine={false}
        style={tickStyles}
      />
      <Bar
        dataKey='value'
        fill='#AB47BC'
        maxBarSize={18}
        animationDuration={4000}
        animationBegin={500}
      />
    </BarChart>
  </ResponsiveContainer>
}

export default Chart
