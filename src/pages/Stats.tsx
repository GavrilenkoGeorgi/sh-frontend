import React, { useEffect, type FC, useState } from 'react'
import { useGetStatsMutation } from '../store/slices/gameApiSlice'
import { type iStats } from '../types'
import Combinations from '../components/charts/Combinations'
import DiceValues from '../components/charts/DiceValues'
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
      console.log('Saved.') // TODO: toasts
    }
  }

  useEffect(() => {
    void loadStats()
  }, [])

  return <section className={styles.container}>
    <h1>Stats</h1>
    <h2>Highest score: {stats?.max}</h2>
    <div className={styles.hChart}>
      <DiceValues />
    </div>
    <div className={styles.sChart}>
      <Combinations />
    </div>
  </section>
}

export default StatsPage
