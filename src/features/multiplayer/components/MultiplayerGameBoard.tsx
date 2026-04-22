import { FC, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import {
  selectActiveGame,
  selectOpponent
} from '../../../store/slices/multiplayerSlice'
import { useMultiplayerTurn } from '../../../hooks/useMultiplayerTurn'
import MultiplayerScoreCard from './MultiplayerScoreCard'
import MultiplayerDnDDiceBoard from './MultiplayerDnDDiceBoard'
import type {
  BasicUser,
  MultiplayerGameState,
  MultiplayerPlayerState
} from '../types'
import * as styles from './MultiplayerGameBoard.module.sass'

const PREVIEW_OPPONENT: BasicUser = {
  id: 'debug-opponent',
  username: 'debug opponent'
}

const createEmptyPlayerState = (): MultiplayerPlayerState => ({
  totalScore: 0,
  usedCategories: [],
  scoreCard: {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    pair: null,
    twoPairs: null,
    triple: null,
    full: null,
    quads: null,
    poker: null,
    small: null,
    large: null,
    chance: null
  }
})

interface MultiplayerGameBoardProps {
  forcePreview?: boolean
}

const MultiplayerGameBoard: FC<MultiplayerGameBoardProps> = ({
  forcePreview = false
}) => {
  const activeGame = useSelector(selectActiveGame)
  const opponent = useSelector(selectOpponent)
  const currentUser = useSelector(selectCurrentUser)

  const previewPlayerId = currentUser?._id ?? 'debug-player'
  const previewGame = useMemo<MultiplayerGameState>(
    () => ({
      gameId: 'debug-game',
      status: 'active',
      player1Id: previewPlayerId,
      player2Id: PREVIEW_OPPONENT.id,
      currentTurnPlayerId: previewPlayerId,
      turnNumber: 1,
      players: {
        [previewPlayerId]: createEmptyPlayerState(),
        [PREVIEW_OPPONENT.id]: createEmptyPlayerState()
      }
    }),
    [previewPlayerId]
  )

  const isPreviewMode = forcePreview && !activeGame
  const gameToRender = isPreviewMode ? previewGame : activeGame
  const opponentToRender = isPreviewMode ? PREVIEW_OPPONENT : opponent

  if (!gameToRender || !opponentToRender || (!currentUser && !isPreviewMode)) {
    return null
  }

  const myId = currentUser?._id ?? previewPlayerId
  const isMyTurn = gameToRender.currentTurnPlayerId === myId
  const myState = gameToRender.players[myId] ?? null

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
  } = useMultiplayerTurn(
    myState,
    isMyTurn,
    isPreviewMode ? null : gameToRender.gameId
  )

  const opponentState = gameToRender.players[opponentToRender.id]

  if (!myState || !opponentState) {
    return null
  }

  return (
    <section className={styles.gameBoard}>
      <button
        disabled={!isMyTurn || !canSubmit}
        className={styles.submitButton}
        onClick={submitTurn}
      >
        Submit turn
      </button>
      {!isMyTurn && (
        <p className={styles.waitingMessage}>
          Waiting for {opponentToRender.username} to finish their turn…
        </p>
      )}
      <MultiplayerScoreCard
        playerState={myState}
        opponentState={opponentState}
        playerName="You"
        opponentName={opponentToRender.username}
        previewScores={isMyTurn ? previewScores : undefined}
        selectedCategory={selectedCategory}
        onCategorySelect={isMyTurn ? selectCategory : undefined}
      />
      {isMyTurn && (
        <div className={styles.diceControlsContainer}>
          <MultiplayerDnDDiceBoard
            dice={dice}
            selectedIndices={selectedIndices}
            rollCount={rollCount}
            isLocked={isLocked}
            selectDie={selectDie}
            deselectDie={deselectDie}
            roll={roll}
          />
        </div>
      )}
    </section>
  )
}

export default MultiplayerGameBoard
