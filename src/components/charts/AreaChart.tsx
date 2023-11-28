import React, { type FC } from 'react'
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { type ChartProps } from '../../types'

import { tickStyles } from './BarChart'

const Chart: FC<ChartProps> = ({ data }) => {

  const margin = {
    top: 10,
    right: 30,
    left: -10,
    bottom: 10
  }

  return <ResponsiveContainer>
    <AreaChart data={data}
      margin={margin}
    >
      <defs>
        <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='5%' stopColor='#AB47BC' stopOpacity={0.5} />
          <stop offset='95%' stopColor='#AB47BC' stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid
        strokeDasharray='4 6'
        strokeWidth={0.6}
      />
      <XAxis
        dataKey='id'
        hide
      />
      <YAxis
        tickCount={4}
        tickSize={0}
        tickMargin={10}
        axisLine={false}
        style={tickStyles}
      />
      <Tooltip />
      <Area type='basis'
        dataKey='value'
        stroke='#AB47BC'
        fill='url(#color)'
        animationDuration={4000}
        animationBegin={500}
        animationEasing='ease-out'
      />
    </AreaChart>
  </ResponsiveContainer>
}

export default Chart
