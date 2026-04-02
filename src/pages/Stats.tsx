import { type FC } from 'react'
import CountUp from 'react-countup'
import { useGetStatsQuery } from '../store/slices/gameApiSlice'
import { formatDateChartAxisData, formatLabelChartAxisData } from '../utils'
import AreaChart from '../components/charts/AreaChart'
import BarChart from '../components/charts/BarChart'
import VertBarChart from '../components/charts/VertBarChart'
import * as styles from './Stats.module.sass'
import * as sharedStyles from './SharedStyles.module.sass'
import Fallback from '../components/layout/Fallback'

const StatsPage: FC = () => {
  const { data, isLoading } = useGetStatsQuery()

  if (!data || isLoading) return <Fallback />

  return (
    <section className={sharedStyles.contentPage}>
      <div className={styles.stats}>
        <h1>Stats</h1>
        {data.games === 0 ? (
          <h2 className={styles.noGames}>No games played yet</h2>
        ) : (
          <>
            <h2>
              Highest score:{' '}
              <span>
                <CountUp start={0} end={data.max} delay={0.75} duration={3} />
              </span>
            </h2>

            <h3>
              Average:&nbsp;
              <span>
                <CountUp
                  start={0}
                  end={data.average}
                  delay={1.25}
                  duration={3}
                />
              </span>{' '}
              which is&nbsp;
              <span>
                <CountUp
                  start={0}
                  end={data.percentFromMax}
                  delay={1.75}
                  duration={4}
                  suffix="%"
                />
              </span>{' '}
              from max
            </h3>

            <h4>{data.games} games so far</h4>

            <aside>
              <h4>School scores</h4>
              <div className={styles.hChart}>
                <AreaChart data={formatDateChartAxisData(data.schoolScores)} />
              </div>
            </aside>

            <aside>
              <h4>Scores</h4>
              <div className={styles.hChart}>
                <AreaChart data={formatDateChartAxisData(data.scores)} />
              </div>
            </aside>

            <aside>
              <h4>Fav dice values</h4>
              <div className={styles.hChart}>
                <BarChart data={formatLabelChartAxisData(data.favDiceValues)} />
              </div>
            </aside>

            <aside>
              <h4>Freq combinations</h4>
              <div className={styles.sChart}>
                <VertBarChart data={formatLabelChartAxisData(data.favComb)} />
              </div>
            </aside>
          </>
        )}
      </div>
    </section>
  )
}

export default StatsPage
