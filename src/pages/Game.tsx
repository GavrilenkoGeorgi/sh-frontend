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

const GamePage: FC = () => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [saveResults] = useSaveResultsMutation()
  const navigate = useNavigate()

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

  return <section className={styles.game}>
    <h1>
      Score:&nbsp;
      <CountUp
        end={game.score}
        duration={5}
        preserveValue={true}
      />
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
