import React, { useMemo, type FC } from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear, scaleBand } from '@visx/scale'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid'
import { useSpring, animated } from '@react-spring/web'
import { type ChartProps, SchoolCombinations } from '../../types'

import styles from './FavDiceValues.module.sass'

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 }

const FavDiceValues: FC<ChartProps> = ({ width, height, margin = defaultMargin }) => {
  if (width < 10) return null

  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { duration: 500 }
  })

  const AnimatedBar = animated(Bar)

  const names = Object.values(SchoolCombinations)
  // mock data
  const data = [32, 45, 100, 45, 16, 23]

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  const valuesScale = useMemo(() => scaleBand<string>({
    range: [0, xMax],
    round: true,
    domain: names.map(name => name),
    padding: 0.75
  }), [xMax])

  const persentScale = useMemo(() => scaleLinear<number>({
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
            scale={persentScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
            strokeDasharray='3'
          />
          <GridColumns
            scale={valuesScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />

          {data.map((value, index) => {
            const name = names[index]
            const barWidth = valuesScale.bandwidth()
            const barHeight = yMax - (persentScale(value) ?? 0)
            const barX = valuesScale(name)
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
            scale={persentScale}
            tickClassName={styles.axisTicks}
          />
          <AxisBottom
            top={yMax}
            scale={valuesScale}
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

export default FavDiceValues
