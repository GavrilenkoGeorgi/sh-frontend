import { useState, type FC } from 'react'
import CountUp from 'react-countup'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useGetStatsQuery } from '../store/api/gameApi'
import {
  formatDateChartAxisData,
  formatLabelChartAxisData,
  parseStatsSearchParams,
  buildStatsQueryString
} from '../utils'
import type { StatsFilterParams } from '../types'
import AreaChart from '../components/charts/AreaChart'
import BarChart from '../components/charts/BarChart'
import VertBarChart from '../components/charts/VertBarChart'
import * as styles from './Stats.module.sass'
import * as sharedStyles from './SharedStyles.module.sass'
import Fallback from '../components/layout/Fallback'
import { DashedLineLegend } from '../components/charts/DashedLineLegend'
import StatsFilters from '../components/stats/StatsFilters'
import { StatsRadarChart } from '../components/charts/StatsRadarChart'
import AppSelect from '../components/select/CustomSelect'

const ChartType = {
  bar: 'bar',
  radar: 'radar'
} as const

type ChartType = (typeof ChartType)[keyof typeof ChartType]

const StatsPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseStatsSearchParams(searchParams)
  const { data, isLoading } = useGetStatsQuery(filters)
  const { t } = useTranslation()
  const [diceValuesChartType, setDiceValuesChartType] = useState<ChartType>(
    ChartType.radar
  )
  const [combinationChartType, setCombinationChartType] = useState<ChartType>(
    ChartType.bar
  )

  const chartOptions = [
    {
      value: ChartType.radar,
      label: t('pages.stats.controls.chartTypeRadar')
    },
    {
      value: ChartType.bar,
      label: t('pages.stats.controls.chartTypeBar')
    }
  ]

  const handleFiltersChange = (newFilters: StatsFilterParams) => {
    setSearchParams(new URLSearchParams(buildStatsQueryString(newFilters)))
  }

  if (!data || isLoading) return <Fallback />

  if (data.summary.games === 0) {
    return (
      <section className={sharedStyles.contentPage}>
        <div className={styles.stats}>
          <h1>{t('pages.stats.title')}</h1>
          <StatsFilters filters={filters} onChange={handleFiltersChange} />
          <h2 className={styles.noGames}>{t('pages.stats.noGames')}</h2>
        </div>
      </section>
    )
  }

  return (
    <section className={sharedStyles.contentPage}>
      <div className={styles.stats}>
        <h1>{t('pages.stats.title')}</h1>

        <h2>
          {t('pages.stats.highestScoreLabel')}{' '}
          <span className={styles.threeNums}>
            <CountUp
              start={0}
              end={data.summary.max}
              delay={0.75}
              duration={3}
            />
          </span>
        </h2>

        <h3>
          {t('pages.stats.averageLabel')}&nbsp;
          <span className={styles.threeNums}>
            <CountUp
              start={0}
              end={data.summary.average}
              delay={1.25}
              duration={3}
            />
          </span>{' '}
          {t('pages.stats.averageWhichIs')}&nbsp;
          <span className={styles.threeNums}>
            <CountUp
              start={0}
              end={data.summary.percentFromMax}
              delay={1.75}
              duration={4}
              suffix="%"
            />
          </span>{' '}
          {t('pages.stats.averageFromMax')}
        </h3>

        <h4>{t('pages.stats.gamesSoFar', { count: data.summary.games })}</h4>

        <StatsFilters filters={filters} onChange={handleFiltersChange} />

        <aside>
          <h4>{t('pages.stats.schoolScores')}</h4>
          <div className={styles.hChart}>
            <AreaChart
              data={formatDateChartAxisData(data.schoolScores)}
              syncId="shStats"
              referenceValue={data.summary.schoolAverage}
            />
            <div className={styles.legend}>
              <DashedLineLegend />
              <span>{t('pages.stats.averageDescription')}</span>
            </div>
          </div>
        </aside>

        <aside>
          <h4>{t('pages.stats.scores')}</h4>
          <div className={styles.hChart}>
            <AreaChart
              data={formatDateChartAxisData(data.scores)}
              syncId="shStats"
              referenceValue={data.summary.average}
            />
            <div className={styles.legend}>
              <DashedLineLegend />
              <span>{t('pages.stats.averageDescription')}</span>
            </div>
          </div>
        </aside>

        <aside>
          <h4>{t('pages.stats.favouriteDiceValues')}</h4>
          <div className={styles.chartTypeSelect}>
            <AppSelect
              options={chartOptions}
              value={
                chartOptions.find((o) => o.value === diceValuesChartType) ??
                null
              }
              onChange={(option) =>
                option && setDiceValuesChartType(option.value as ChartType)
              }
              className={styles.presetSelect}
            />
          </div>
          {diceValuesChartType === ChartType.radar ? (
            <div className={styles.radarChartContainer}>
              <StatsRadarChart data={data.favDiceValues} />
            </div>
          ) : (
            <div className={styles.hChart} style={{ marginTop: '3rem' }}>
              <BarChart data={formatLabelChartAxisData(data.favDiceValues)} />
            </div>
          )}
        </aside>

        <aside>
          <h4>{t('pages.stats.favouriteCombinations')}</h4>
          <div className={styles.chartTypeSelect}>
            <AppSelect
              options={chartOptions}
              value={
                chartOptions.find((o) => o.value === combinationChartType) ??
                null
              }
              onChange={(option) =>
                option && setCombinationChartType(option.value as ChartType)
              }
              className={styles.presetSelect}
            />
          </div>
          {combinationChartType === ChartType.radar ? (
            <div className={styles.radarChartContainer}>
              <StatsRadarChart data={data.favComb} />
            </div>
          ) : (
            <div className={styles.sChart}>
              <VertBarChart data={formatLabelChartAxisData(data.favComb)} />
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export default StatsPage
