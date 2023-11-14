import React, { type FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [saveResults] = useSaveResultsMutation()

  const complete = async (): Promise<void> => {
    try {
      const data = {
        score: game.score,
        schoolScore: game.schoolScore,
        stats: game.stats,
        favDiceValues: game.favDiceValues
      }

      if (userInfo === null) console.log('CTA to register')
      else await saveResults(data)

      dispatch(reset())

    } catch (err) {
      console.log(err) // TODO: proper err handling
    } finally {
      console.log('Saved.') // TODO: toasts
    }
  }

  // on selection change calc score
  useEffect(() => {
    if (game.selection.length > 0) {
      dispatch(setScore(game.selection))
    }
  }, [game.selection])

  return <section className={styles.game}>
    <h1>Score: {game.score}</h1>
    {/* Training */}
    <TrainingBoard />
    {/* Game */}
    <ScoreBoard />
    {/* Game controls */}
    <ProgressBar count={game.rollCount} />
    <DnDDiceBoard />
    {/* Modals */}
    {game.end &&
      <Modal
        heading='Game end'
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
        btnLabel='save'
        onClick={() => { void complete() }}
      />
    }
  </section>
}

export default GamePage
