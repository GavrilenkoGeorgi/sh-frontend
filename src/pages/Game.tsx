import { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

// state
import type { RootState } from '../store'
import { useSaveResultsMutation } from '../store/api/gameApi'
import { reset, GameState, MAX_TURNS } from '../store/slices/shSlice'
import { setNotification } from '../store/slices/notificationSlice'
import { selectCurrentUser } from '../store/slices/authSlice'
import { toPath } from '../utils'
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

export type SaveResultsData = Pick<
  GameState,
  'score' | 'schoolScore' | 'stats' | 'favDiceValues'
>

const GamePage: FC = () => {
  const dispatch = useDispatch()
  const { game } = useSelector((state: RootState) => state.sh)
  const notificationMessage = useSelector(
    (state: RootState) => state.notification.message
  )
  const user = useSelector(selectCurrentUser)
  const [saveResults, { isLoading }] = useSaveResultsMutation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const saveBtnLabel = user
    ? t('ui.buttonLabels.save')
    : t('ui.buttonLabels.ok')

  const handleComplete = async (): Promise<void> => {
    try {
      if (!user) {
        dispatch(reset())
        return
      }

      const data: SaveResultsData = {
        score: game.score,
        schoolScore: game.schoolScore,
        stats: game.stats,
        favDiceValues: game.favDiceValues
      }

      await saveResults(data).unwrap()
      dispatch(reset())
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.savedResults'),
          type: ToastTypes.SUCCESS
        })
      )
      navigate(toPath(ROUTES.STATS), { viewTransition: true })
    } catch {
      // error toast is handled centrally in baseQueryWithReauth
    }
  }

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
        {game.over &&
          game.schoolFailedNotified &&
          notificationMessage === null && (
            <Modal
              heading={t('ui.headings.gameOver')}
              text={t('ui.headings.gameOverMsg')}
              btnLabel={t('ui.buttonLabels.ok')}
              onClick={() => dispatch(reset())}
            />
          )}
        {game.turn === MAX_TURNS && (
          <Modal
            heading={t('ui.headings.congratulations')}
            score={game.score}
            text={t('ui.headings.scoreMsg')}
            userName={user?.name}
            btnLabel={saveBtnLabel}
            isBusy={Boolean(user) && isLoading}
            onClick={handleComplete}
          />
        )}
      </section>
      <ProgressBar count={game.rollCount} />
    </>
  )
}

export default GamePage
