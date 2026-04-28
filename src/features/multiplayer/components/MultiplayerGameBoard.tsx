import { FC, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { setNotification } from '../../../store/slices/notificationSlice'
import { ToastTypes } from '../../../types'
import { useTranslation } from 'react-i18next'

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
  const dispatch = useDispatch()
  const activeGame = useSelector(selectActiveGame)
  const opponent = useSelector(selectOpponent)
  const currentUser = useSelector(selectCurrentUser)
  const { t } = useTranslation()

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
    schoolFailed,
    hasUnselectedScoringDice,
    roll,
    selectDie,
    deselectDie,
    selectCategory,
    submitTurn,
    failSchool
  } = useMultiplayerTurn(
    myState,
    isMyTurn,
    isPreviewMode ? null : gameToRender.gameId
  )

  const opponentState = gameToRender.players[opponentToRender.id]

  useEffect(() => {
    if (hasUnselectedScoringDice) {
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.schoolCheck'),
          type: ToastTypes.WARNING
        })
      )
    }
  }, [hasUnselectedScoringDice, dispatch, t])

  useEffect(() => {
    if (schoolFailed) {
      dispatch(
        setNotification({
          msg: t('ui.multiplayer.noSchoolCombination'),
          type: ToastTypes.WARNING
        })
      )
    }
  }, [schoolFailed, dispatch, t])

  if (!myState || !opponentState) {
    return null
  }

  return (
    <section className={styles.gameBoard}>
      <MultiplayerScoreCard
        player={{ state: myState, name: 'You' }}
        opponent={{ state: opponentState, name: opponentToRender.username }}
        turnControls={{
          isMyTurn,
          canSubmit,
          schoolFailed: isMyTurn ? schoolFailed : undefined,
          previewScores: isMyTurn ? previewScores : undefined,
          selectedCategory,
          onCategorySelect: isMyTurn ? selectCategory : undefined,
          onSubmitTurn: submitTurn,
          onFailSchool: isMyTurn ? failSchool : undefined
        }}
      />
      <div className={styles.diceControlsContainer}>
        <MultiplayerDnDDiceBoard
          dice={isMyTurn ? dice : [0, 0, 0, 0, 0]}
          selectedIndices={isMyTurn ? selectedIndices : []}
          rollCount={isMyTurn ? rollCount : 0}
          isLocked={!isMyTurn || isLocked}
          selectDie={selectDie}
          deselectDie={deselectDie}
          roll={roll}
        />
      </div>
    </section>
  )
}

export default MultiplayerGameBoard
