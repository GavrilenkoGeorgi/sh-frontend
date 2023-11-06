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

import { tickStyles } from './BarChart'

const Chart: FC<ChartProps> = ({ data }) => {

  const margin = {
    top: 10,
    right: 30,
    left: 10,
    bottom: 10
  }

  return <ResponsiveContainer>
    <BarChart data={data} margin={margin} layout='vertical' >
      <CartesianGrid
        strokeDasharray='4 6'
        strokeWidth={0.6}
        horizontal={false}
      />
      <XAxis
        type='number'
        tickSize={0}
        tickMargin={10}
        tickCount={7}
        axisLine={false}
        style={tickStyles}
      />
      <YAxis
        type='category'
        dataKey='id'
        tickSize={0}
        tickMargin={10}
        axisLine={false}
        style={tickStyles}
      />
      <Bar
        dataKey='value'
        fill='#AB47BC'
        maxBarSize={20}
        animationDuration={2000}
        animationBegin={500}
      />
    </BarChart>
  </ResponsiveContainer>
}

export default Chart
