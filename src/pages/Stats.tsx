import React, { type FC } from 'react'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import FavDiceValues from '../components/charts/FavDiceValues'

import styles from './Stats.module.sass'

const StatsPage: FC = () => {
  return <section className={styles.container}>
    <h1>Stats</h1>
    <div className={styles.chart}>
      <ParentSize>
        {({ width, height }) => <FavDiceValues width={width} height={height} />}
      </ParentSize>
    </div>
  </section>
}

export default StatsPage
