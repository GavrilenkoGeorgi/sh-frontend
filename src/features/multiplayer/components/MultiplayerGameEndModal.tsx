import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import {
  clearGameEnd,
  selectGameEndResult,
  selectOpponent
} from '../../../store/slices/multiplayerSlice'
import * as styles from './MultiplayerGameBoard.module.sass'
import { useTranslation } from 'react-i18next'

const MultiplayerGameEndModal: FC = () => {
  const dispatch = useDispatch()
  const gameEndResult = useSelector(selectGameEndResult)
  const opponent = useSelector(selectOpponent)
  const currentUser = useSelector(selectCurrentUser)
  const { t } = useTranslation()

  if (!gameEndResult) {
    return null
  }

  const myId = currentUser?._id ?? ''
  const players = gameEndResult.gameState?.players
  const opponentPlayerId =
    opponent?.id ??
    Object.keys(players ?? {}).find((playerId) => playerId !== myId)
  const myScore = players?.[myId]?.totalScore
  const opponentScore = opponentPlayerId
    ? players?.[opponentPlayerId]?.totalScore
    : undefined

  const opponentName = opponent?.username ?? t('ui.multiplayer.opponent')

  let heading = t('ui.multiplayer.gameOver')
  let message = ''

  if (gameEndResult.reason === 'opponent_disconnected') {
    heading = t('ui.multiplayer.opponentDisconnected')
    message = `${opponentName} ${t('ui.multiplayer.opponentLeft')}`
  } else if (
    gameEndResult.winnerId === undefined ||
    gameEndResult.winnerId === null
  ) {
    heading = t('ui.multiplayer.tie')
    message = t('ui.multiplayer.tieMessage')
  } else if (gameEndResult.winnerId === myId) {
    heading = t('ui.multiplayer.youWon')
    message = `${t('ui.multiplayer.youWonMessage')} ${opponentName}`
  } else {
    heading = t('ui.multiplayer.youLost')
    message = `${opponentName} ${t('ui.multiplayer.youLostMessage')}`
  }

  const handleBackToLobby = () => {
    dispatch(clearGameEnd())
  }

  return (
    <div className={styles.endOverlay}>
      <div className={styles.endModal}>
        <h2 className={styles.endHeading}>{heading}</h2>
        <p className={styles.endMessage}>{message}</p>
        {myScore !== undefined && opponentScore !== undefined && (
          <p className={styles.endScores}>
            {myScore} : {opponentScore}
          </p>
        )}
        <button
          type="button"
          className={styles.endButton}
          onClick={handleBackToLobby}
        >
          {t('ui.multiplayer.backToLobby')}
        </button>
      </div>
    </div>
  )
}

export default MultiplayerGameEndModal
