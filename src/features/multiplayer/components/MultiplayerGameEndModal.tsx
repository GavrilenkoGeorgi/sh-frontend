import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import {
  clearGameEnd,
  selectGameEndResult,
  selectOpponent
} from '../../../store/slices/multiplayerSlice'
import * as styles from './MultiplayerGameBoard.module.sass'

const MultiplayerGameEndModal: FC = () => {
  const dispatch = useDispatch()
  const gameEndResult = useSelector(selectGameEndResult)
  const opponent = useSelector(selectOpponent)
  const currentUser = useSelector(selectCurrentUser)

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

  const opponentName = opponent?.username ?? 'opponent'

  let heading = 'Game over'
  let message = ''

  if (gameEndResult.reason === 'opponent_disconnected') {
    heading = 'Opponent disconnected'
    message = `${opponentName} left the game.`
  } else if (
    gameEndResult.winnerId === undefined ||
    gameEndResult.winnerId === null
  ) {
    heading = "It's a tie!"
    message = 'You both scored the same.'
  } else if (gameEndResult.winnerId === myId) {
    heading = 'You won!'
    message = `Congratulations! You beat ${opponentName}.`
  } else {
    heading = 'You lost'
    message = `${opponentName} won this time.`
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
            {myScore} - {opponentScore}
          </p>
        )}
        <button
          type="button"
          className={styles.endButton}
          onClick={handleBackToLobby}
        >
          Back to lobby
        </button>
      </div>
    </div>
  )
}

export default MultiplayerGameEndModal
