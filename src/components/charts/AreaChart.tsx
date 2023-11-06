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

const ReCharts: FC<ChartProps> = ({ data }) => {

  return <ResponsiveContainer>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#AB47BC" stopOpacity={0.5}/>
          <stop offset="95%" stopColor="#AB47BC" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='id' />
      <YAxis />
      <Tooltip />
      <Area type='monotone' dataKey='value' stroke='#AB47BC' fill='url(#color)' />
    </AreaChart>
  </ResponsiveContainer>
}

export default ReCharts
