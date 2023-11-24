import React, { type FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CountUp from 'react-countup'

// state
import type { RootState } from '../store'
import { useSaveResultsMutation } from '../store/slices/gameApiSlice'
import { setScore, reset } from '../store/slices/shSlice'

// components and styles
import TrainingBoard from '../components/game/TrainingBoard'
import ScoreBoard from '../components/game/ScoreBoard'
import ProgressBar from '../components/layout/ProgressBar'
import DnDDiceBoard from '../components/game/controls/DnDDiceBoard'
import Modal from '../components/layout/Modal'
import styles from './Game.module.sass'
import type { Counter } from '../types'

const GamePage: FC = () => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [saveResults] = useSaveResultsMutation()
  const navigate = useNavigate()

  const [counter, setCounter] = useState<Counter>({
    start: 0,
    end: 0
  })

  const complete = async (): Promise<void> => {
    try {
      const data = {
        score: game.score,
        schoolScore: game.schoolScore,
        stats: game.stats,
        favDiceValues: game.favDiceValues
      }

      setIsSubmitting(true)
      if (userInfo != null) await saveResults(data)
      dispatch(reset())
      navigate('/stats')
    } catch (err) {
      console.log(err) // TODO: proper err handling
    } finally {
      console.log('Saved.') // TODO: toasts
      setIsSubmitting(false)
    }
  }

  // on selection change calc score
  useEffect(() => {
    if (game.selection.length > 0) {
      dispatch(setScore(game.selection))
    }
  }, [game.selection])

  useEffect(() => {
    setCounter(prev => ({ ...prev, start: (game.score - counter.start), end: game.score }))
  }, [game.score])

  return <section className={styles.game}>
    <h1>
      Score: <CountUp start={counter.start} end={counter.end} duration={3} />
    </h1>
    {/* Training */}
    <TrainingBoard />
    {/* Game */}
    <ScoreBoard />
    {/* Game controls */}
    <DnDDiceBoard />
    <ProgressBar count={game.rollCount} />
    {/* Modals */}
    {game.over &&
      <Modal
        heading='Game over'
        text='Better luck next time!'
        btnLabel='ok'
        onClick={() => dispatch(reset())}
      />
    }
    {game.turn === 34 &&
      <Modal
        heading='🎉 Congrats! ✨'
        score={game.score}
        text='Your score is '
        userName={userInfo?.name}
        btnLabel='save'
        isBusy={isSubmitting}
        onClick={() => { void complete() }}
      />
    }
  </section>
}

export default GamePage
