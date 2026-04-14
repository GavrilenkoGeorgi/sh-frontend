import React, { type FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

// state
import type { RootState } from '../store'
import { useSaveResultsMutation } from '../store/slices/gameApiSlice'
import { setScore, reset, GameState, MAX_TURNS } from '../store/slices/shSlice'
import { setNotification } from '../store/slices/notificationSlice'
import { selectCurrentUser } from '../store/slices/authSlice'
import { getErrMsg, toPath } from '../utils'
import { ToastTypes } from '../types'

// components and styles
import TrainingBoard from '../components/game/TrainingBoard'
import ScoreBoard from '../components/game/ScoreBoard'
import ProgressBar from '../components/layout/ProgressBar'
import DnDDiceBoard from '../components/game/controls/DnDDiceBoard'
import Modal from '../components/layout/Modal'
import GameTour from '../components/tour/GameTour'
import * as styles from './Game.module.sass'
import { ROUTES } from '../constants/routes'
import { useTranslation } from 'react-i18next'

export interface SaveResultsData extends Pick<
  GameState,
  'score' | 'schoolScore' | 'stats' | 'favDiceValues'
> {}

const GamePage: FC = () => {
  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)
  const user = useSelector(selectCurrentUser)
  const [saveResults, { isLoading }] = useSaveResultsMutation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleComplete = async (): Promise<void> => {
    try {
      if (!user) {
        dispatch(reset())
        return
      }

      const data = {
        score: game.score,
        schoolScore: game.schoolScore,
        stats: game.stats,
        favDiceValues: game.favDiceValues
      } as SaveResultsData

      await saveResults(data).unwrap()
      dispatch(reset())
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.savedResults'),
          type: ToastTypes.SUCCESS
        })
      )
      navigate(toPath(ROUTES.STATS), { viewTransition: true })
    } catch (err: unknown) {
      dispatch(
        setNotification({
          msg: getErrMsg(err),
          type: ToastTypes.ERROR
        })
      )
    }
  }

  // on selection change calc score
  useEffect(() => {
    if (game.selection.length > 0) {
      // selection stores indices, convert to face values for scoring
      const selectedValues = game.selection.map((i) => game.roll[i])
      dispatch(setScore(selectedValues))
    }
  }, [game.selection])

  return (
    <>
      <section className={styles.game}>
        <div className={styles.content}>
          {/* Training */}
          <TrainingBoard />
          {/* Game */}
          <ScoreBoard />
          {/* Game controls */}
          <DnDDiceBoard />
          {/* Modals */}
        </div>
        <GameTour />
        {game.over && (
          <Modal
            heading="Game over"
            text="Better luck next time!"
            btnLabel="ok"
            onClick={() => dispatch(reset())}
          />
        )}
        {game.turn === MAX_TURNS && (
          <Modal
            heading="Congratulations!"
            score={game.score}
            text="Your score is "
            userName={user?.name}
            btnLabel={user ? 'save' : 'ok'}
            isBusy={Boolean(user) && isLoading}
            onClick={() => handleComplete()}
          />
        )}
      </section>
      <ProgressBar count={game.rollCount} />
    </>
  )
}

export default GamePage
