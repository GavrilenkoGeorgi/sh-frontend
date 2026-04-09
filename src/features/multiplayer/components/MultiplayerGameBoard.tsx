import { FC } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import {
  selectActiveGame,
  selectOpponent
} from '../../../store/slices/multiplayerSlice'
import { useMultiplayerTurn } from '../../../hooks/useMultiplayerTurn'
import { Dice as DiceSVG } from '../../../components/game/Dice'
import MultiplayerScoreCard from './MultiplayerScoreCard'
import * as styles from './MultiplayerGameBoard.module.sass'

const MultiplayerGameBoard: FC = () => {
  const activeGame = useSelector(selectActiveGame)
  const opponent = useSelector(selectOpponent)
  const currentUser = useSelector(selectCurrentUser)

  const myId = currentUser?._id ?? ''
  const isMyTurn = activeGame?.currentTurnPlayerId === myId
  const myState = activeGame?.players[myId] ?? null

  const {
    dice,
    selectedIndices,
    rollCount,
    selectedCategory,
    previewScores,
    isLocked,
    canSubmit,
    roll,
    selectDie,
    deselectDie,
    selectCategory,
    submitTurn
  } = useMultiplayerTurn(myState, isMyTurn, activeGame?.gameId ?? null)

  if (!activeGame || !opponent || !currentUser) {
    return null
  }

  const opponentState = activeGame.players[opponent.id]

  if (!myState || !opponentState) {
    return null
  }

  const handleDieClick = (index: number) => {
    if (!isMyTurn || rollCount === 0) return
    if (selectedIndices.includes(index)) {
      deselectDie(index)
    } else {
      selectDie(index)
    }
  }

  return (
    <section className={styles.gameBoard}>
      {isMyTurn && (
        <div className={styles.diceArea}>
          <div className={styles.diceRow}>
            {dice.map((value, index) => (
              <div
                key={index}
                className={`${styles.dieWrapper} ${selectedIndices.includes(index) ? styles.dieSelected : ''}`}
                onClick={() => handleDieClick(index)}
              >
                <DiceSVG kind={value} />
              </div>
            ))}
          </div>
          <button
            className={`${styles.rollButton} ${isLocked ? styles.rollButtonLocked : ''}`}
            onClick={roll}
            disabled={isLocked}
          >
            {rollCount === 0 ? 'Roll' : `Roll (${3 - rollCount} left)`}
          </button>
        </div>
      )}

      <MultiplayerScoreCard
        playerState={myState}
        opponentState={opponentState}
        playerName="You"
        opponentName={opponent.username}
        previewScores={isMyTurn ? previewScores : undefined}
        selectedCategory={selectedCategory}
        onCategorySelect={isMyTurn ? selectCategory : undefined}
      />

      <button
        disabled={!isMyTurn || !canSubmit}
        className={styles.submitButton}
        onClick={submitTurn}
      >
        Submit turn
      </button>

      {!isMyTurn && (
        <p className={styles.waitingMessage}>
          Waiting for {opponent.username} to finish their turn…
        </p>
      )}
    </section>
  )
}

export default MultiplayerGameBoard
