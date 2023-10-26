import React, { type FC } from 'react'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import DiceValues from '../components/charts/DiceValues'
import Combinations from '../components/charts/Combinations'

import styles from './Stats.module.sass'

const StatsPage: FC = () => {
  return <section className={styles.container}>
    <h1>Stats</h1>
    <div className={styles.hChart}>
      <ParentSize>
        {({ width, height }) => <DiceValues width={width} height={height} />}
      </ParentSize>
    </div>
    <div className={styles.sChart}>
      <ParentSize>
        {({ width, height }) => <Combinations width={width} height={height} />}
      </ParentSize>
    </div>
  </section>
}

export default StatsPage
