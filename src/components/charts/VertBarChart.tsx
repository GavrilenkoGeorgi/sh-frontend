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

const Chart: FC<ChartProps> = ({ data }) => {

  const margin = {
    top: 10,
    right: 30,
    left: 10,
    bottom: 10
  }

  return <ResponsiveContainer>
    <BarChart data={data} margin={margin} layout='vertical' >
      <CartesianGrid strokeDasharray='3 3'/>
      <XAxis type='number' hide />
      <YAxis type='category' dataKey='id' />
      <Bar dataKey='value' fill='#AB47BC' maxBarSize={20} />
    </BarChart>
  </ResponsiveContainer>
}

export default Chart
