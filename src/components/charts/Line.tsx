import React, { type FC, useMemo } from 'react'
import { curveMonotoneX } from '@visx/curve'
import { scaleLinear } from '@visx/scale'

import { AnimatedLineSeries, XYChart } from '@visx/xychart'

import { AxisLeft } from '@visx/axis'
import { GridRows } from '@visx/grid'
import { type ChartProps } from '../../types'
import { withParentSize } from '../charts/withParentSize'

const margin = { top: 30, right: 30, bottom: 30, left: 40 }

const LineChart: FC<ChartProps> = ({ axisData, parentHeight, parentWidth, ...props }: ChartProps) => {

  interface Data {
    id: string
    value: number
  }

  const accessors = {
    xAccessor: (d: Data): string => d.id.substring(0, 3),
    yAccessor: (d: Data): number => d.value
  }

  const xMax = parentWidth - margin.left - margin.right
  const yMax = parentHeight - margin.top - margin.bottom

  const yScale = useMemo(() => scaleLinear<number>({
    range: [Math.min(...axisData.map(accessors.yAccessor)), 0],
    domain: [Math.min(...axisData.map(accessors.yAccessor)), Math.max(...axisData.map(accessors.yAccessor))]
  }), [yMax])

  /* const xScale = useMemo(() => scaleBand<string>({
    range: [0, xMax],
    round: true,
    domain: axisData.map(accessors.xAccessor),
    padding: 0.75
  }), [xMax]) */

  return <XYChart
    xScale={{ type: 'band' }}
    yScale={{ type: 'linear' }}
  >
    <GridRows
      top={margin.top}
      left={margin.left}
      scale={yScale}
      numTicks={3}
      width={xMax}
      strokeDasharray='3'
    />
    <AxisLeft
      tickLength={0}
      numTicks={3}
      stroke='transparent'
      left={margin.left}
      top={margin.right}
      hideAxisLine
      scale={yScale}
    />
    <AnimatedLineSeries
      dataKey='Game scores'
      data={axisData}
      {...accessors}
      fillOpacity={0.4}
      stroke='#AB47BC'
      strokeWidth={1}
      curve={curveMonotoneX}
    />
  </XYChart>
}

export default withParentSize(LineChart)
