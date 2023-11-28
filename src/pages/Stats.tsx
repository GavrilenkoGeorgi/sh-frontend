import React, { useEffect, type FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import CountUp from 'react-countup'
import { useGetStatsMutation } from '../store/slices/gameApiSlice'
import { setNotification } from '../store/slices/notificationSlice'
import { type iStats } from '../types'
import { formatChartAxisData } from '../utils'
import AreaChart from '../components/charts/AreaChart'
import BarChart from '../components/charts/BarChart'
import VertBarChart from '../components/charts/VertBarChart'
import styles from './Stats.module.sass'

const StatsPage: FC = () => {

  const dispatch = useDispatch()
  const [getStats] = useGetStatsMutation()
  const [stats, setStats] = useState<iStats>()

  const loadStats = async (): Promise<void> => {
    try {
      const data = await getStats({}).unwrap()
      setStats({
        ...data,
        scores: formatChartAxisData(data.scores),
        schoolScores: formatChartAxisData(data.schoolScores)
      })
    } catch (err: any) {
      dispatch(setNotification({ msg: err.error, type: 'error' }))
    }
  }

  useEffect(() => {
    void loadStats()
  }, [])

  return <>
    {stats != null && <section className={styles.container}>
      <h1>Stats</h1>
      <h2>Highest score: <span>
        <CountUp
          start={0}
          end={stats.max}
          duration={4}
        />
        </span>
      </h2>
      <h3>Average:&nbsp;
        <span>
          <CountUp
            start={0}
            end={stats.average}
            delay={1}
            duration={4}
          />
        </span> which is&nbsp;
        <span>
          <CountUp
            start={0}
            end={stats.percentFromMax}
            delay={3}
            duration={4}
            suffix='%'
          />
        </span> from max
      </h3>
      <h4>{stats.games} games so far</h4>
      <aside>
        <h4>School scores</h4>
        <div className={styles.hChart}>
          <AreaChart data={stats.schoolScores} />
        </div>
      </aside>
      <aside>
        <h4>Scores</h4>
        <div className={styles.hChart}>
          <AreaChart data={stats.scores} />
        </div>
      </aside>
      <aside>
        <h4>Fav dice values</h4>
        <div className={styles.hChart}>
          <BarChart data={stats.favDiceValues} />
        </div>
      </aside>
      <aside>
        <h4>Freq combinations</h4>
        <div className={styles.sChart}>
          <VertBarChart data={stats.favComb} />
        </div>
      </aside>
    </section>
  }</>
}

export default StatsPage
