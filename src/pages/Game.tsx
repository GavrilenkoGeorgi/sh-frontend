import { type FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

// state
import type { RootState } from '../store'
import { useSaveResultsMutation } from '../store/api/gameApi'
import { reset, GameState, MAX_TURNS } from '../store/slices/shSlice'
import { setNotification } from '../store/slices/notificationSlice'
import { toPath } from '../utils'
import { ToastTypes } from '../types'

// components and styles
import TrainingBoard from '../components/game/TrainingBoard'
import ScoreBoard from '../components/game/ScoreBoard'
import ProgressBar from '../components/layout/ProgressBar'
import DnDDiceBoard from '../components/game/controls/DnDDiceBoard'
import GameTour from '../components/tour/GameTour'
import * as styles from './Game.module.sass'
import { ROUTES } from '../constants/routes'
import { useTranslation } from 'react-i18next'
import { BaseModal } from '../components/layout/Modal/BaseModal'
import { Button } from '../components/layout/Button/BaseButton'

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
  const [saveResults, { isLoading }] = useSaveResultsMutation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleComplete = async ({
    save = true
  }: { save?: boolean } = {}): Promise<void> => {
    try {
      if (!save) {
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

  const trainingFailed =
    game.over && game.schoolFailedNotified && notificationMessage === null

  return (
    <>
      <section className={styles.game}>
        {/* Training */}
        <TrainingBoard />
        {/* Game */}
        <ScoreBoard />
        {/* Game controls */}
        <DnDDiceBoard />
        {/* Modals */}
        <GameTour />

        <BaseModal
          isOpen={trainingFailed}
          title={t('ui.headings.gameOver')}
          footerActions={() => (
            <Button onPress={() => handleComplete({ save: false })}>
              {t('ui.buttonLabels.restart')}
            </Button>
          )}
        >
          <span className={styles.text}>{t('ui.headings.gameOverMsg')}</span>
        </BaseModal>

        <BaseModal
          isOpen={game.turn === MAX_TURNS && !trainingFailed}
          title={t('ui.headings.congratulations')}
          footerActions={() => (
            <>
              <Button onPress={() => handleComplete()} isLoading={isLoading}>
                {t('ui.navLinks.stats')}
              </Button>
              <Button
                onPress={() => handleComplete({ save: false })}
                variant="secondary"
              >
                {t('ui.buttonLabels.restart')}
              </Button>
            </>
          )}
        >
          <span className={styles.text}>
            {t('ui.headings.scoreMsg')} {game.score}
          </span>
        </BaseModal>
      </section>
      <ProgressBar count={game.rollCount} />
    </>
  )
}

export default GamePage
