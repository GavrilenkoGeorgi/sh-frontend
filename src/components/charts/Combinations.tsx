import React, { useMemo, type FC } from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear, scaleBand } from '@visx/scale'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid'
import { useSpring, animated } from '@react-spring/web'
import { withParentSize } from './withParentSize'
import { type ChartProps, type ChartAxisData } from '../../types'

import styles from './Charts.module.sass'

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 50 }

const HBarChart: FC<ChartProps> = ({ axisData, parentWidth, parentHeight, margin = defaultMargin }: ChartProps) => {
  const height = parentHeight
  const width = parentWidth
  if (width < 10 || axisData === null) return null

  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    delay: 500,
    config: { duration: 500 }
  })

  const AnimatedBar = animated(Bar)

  const getCombName = (item: ChartAxisData): string => item.id
  const getCombValue = (item: ChartAxisData): number => Number(item.value)

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  const yScale = useMemo(() => scaleBand<string>({
    range: [0, yMax],
    round: true,
    domain: axisData?.map(getCombName),
    padding: 0.55
  }), [xMax])

  const xScale = useMemo(() => scaleLinear<number>({
    range: [0, xMax],
    round: true,
    domain: [0, Math.max(...axisData?.map(getCombValue))]
  }), [yMax])

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top} >
        <GridRows
          scale={yScale}
          width={xMax}
          height={yMax}
          stroke="#e0e0e0"
          strokeDasharray='3'
        />
        <GridColumns
          scale={xScale}
          width={xMax}
          height={yMax}
          stroke="#e0e0e0"
        />
        {axisData?.map((item) => {
          const name = getCombName(item)
          const barWidth = yScale.bandwidth()
          const barHeight = xScale(getCombValue(item))
          const barY = yScale(name)
          return (
            <AnimatedBar
              key={`bar-${name}`}
              y={barY}
              width={scale.to((s) => s * barHeight)}
              height={barWidth}
              fill="#AB47BC"
            />
          )
        })}
        <AxisLeft
          tickStroke='#AB47BC'
          tickLength={0}
          stroke='transparent'
          scale={yScale}
          tickClassName={styles.axisTicks}
        />
        <AxisBottom
          top={yMax}
          scale={xScale}
          tickStroke='#AB47BC'
          tickLength={0}
          stroke='#AB47BC'
          tickClassName={styles.axisTicks}
          hideAxisLine
          numTicks={10}
        />
      </Group>
    </svg>
  )
}

export default withParentSize(HBarChart)
