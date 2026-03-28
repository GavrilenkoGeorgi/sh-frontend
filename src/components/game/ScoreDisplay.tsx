import React, { FC } from 'react'
import CountUp from 'react-countup'
import * as styles from './ScoreDisplay.module.sass'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export const ScoreDisplay: FC = () => {
  const { game } = useSelector((state: RootState) => state.sh)

  return (
    <div className={styles.score}>
      <div className={styles.label}>
        <div className={styles.dropCap}>S</div>
        <div>
          <span>co</span>
          <span>re</span>
        </div>
      </div>
      <CountUp
        end={game.score}
        duration={5}
        preserveValue={true}
        className={styles.dropCap}
      />
    </div>
  )
}
