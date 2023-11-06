import React, { useEffect, type FC, useState } from 'react'
import { useGetStatsMutation } from '../store/slices/gameApiSlice'
import { type iStats } from '../types'
import ReCharts from '../components/charts/AreaChart'
import styles from './Stats.module.sass'

const StatsPage: FC = () => {

  const [getStats] = useGetStatsMutation()
  const [stats, setStats] = useState<iStats>()

  const loadStats = async (): Promise<void> => {
    try {
      const data = await getStats({}).unwrap()
      setStats(data)
    } catch (err) {
      console.log(err) // TODO: proper err handling
    } finally {
      console.log('Stats loaded.') // TODO: toasts!
    }
  }

  useEffect(() => {
    void loadStats()
  }, [])

  return <section className={styles.container}>
    <h1>Stats</h1>
    <h2>Highest score: <span>{stats?.max}</span></h2>
    <h3>Average: <span>{stats?.average}</span> which
      is <span>{stats?.percentFromMax}%</span> from max
    </h3>
    <h4>{stats?.games} games</h4>
    {stats != null && <>
    <aside>
      <div className={styles.hChart}>
        <ReCharts data={stats.scores} />
      </div>
    </aside>
    </>
    }
  </section>
}

export default StatsPage
