import React, { useMemo, type FC } from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear, scaleBand } from '@visx/scale'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid'
import { useSpring, animated } from '@react-spring/web'
import { type BaseChartProps, SchoolCombinations } from '../../types'
import { withParentSize } from './withParentSize'
import styles from './Charts.module.sass'

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 }

const FavDiceValues: FC<BaseChartProps> = ({ parentWidth, parentHeight, margin = defaultMargin }: BaseChartProps) => {
  const height = parentHeight
  const width = parentWidth

  if (width < 10) return null

  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    delay: 250,
    config: { duration: 750 }
  })

  const AnimatedBar = animated(Bar)

  const names = Object.values(SchoolCombinations)
  // mock data
  const data = [32, 45, 100, 45, 16, 23]

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  const xScale = useMemo(() => scaleBand<string>({
    range: [0, xMax],
    round: true,
    domain: names.map(name => name),
    padding: 0.75
  }), [xMax])

  const yScale = useMemo(() => scaleLinear<number>({
    range: [yMax, 0],
    domain: [0, 100],
    nice: true
  }), [yMax])

  return (
    <div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={'transparent'} rx={14} />
        <Group left={margin.left} top={margin.top}>
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

          {data.map((value, index) => {
            const name = names[index]
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(value) ?? 0)
            const barX = xScale(name)
            return <AnimatedBar
                key={`bar-${name}`}
                x={barX}
                y={scale.to((s) => yMax - s * barHeight)}
                width={barWidth}
                height={scale.to((s) => s * barHeight)}
                fill="#AB47BC"
              />
          })}
          <AxisLeft
            tickStroke='#AB47BC'
            tickLength={0}
            numTicks={4}
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
          />
        </Group>
      </svg>
    </div>
  )
}

export default withParentSize(FavDiceValues)
