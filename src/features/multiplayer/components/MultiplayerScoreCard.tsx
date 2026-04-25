import { FC } from 'react'
import type { MultiplayerPlayerState, ScoreCategory } from '../types'
import * as styles from './MultiplayerGameBoard.module.sass'
import LoadingIndicator from '../../../components/layout/LoadingIndicator'

const schoolCategories: ScoreCategory[] = [
  'ones',
  'twos',
  'threes',
  'fours',
  'fives',
  'sixes'
]

const gameCategories: ScoreCategory[] = [
  'pair',
  'twoPairs',
  'triple',
  'full',
  'quads',
  'poker',
  'small',
  'large',
  'chance'
]

interface ScoreCardParticipant {
  state: MultiplayerPlayerState
  name: string
}

interface TurnControls {
  isMyTurn: boolean
  canSubmit: boolean
  previewScores?: Partial<Record<ScoreCategory, number>>
  selectedCategory?: ScoreCategory | null
  onCategorySelect?: (category: ScoreCategory) => void
  onSubmitTurn: () => void
}

interface MultiplayerScoreCardProps {
  player: ScoreCardParticipant
  opponent: ScoreCardParticipant
  turnControls: TurnControls
}

const formatCategoryName = (category: ScoreCategory): string => {
  return category.replace(/([A-Z])/g, ' $1').toLowerCase()
}

const MultiplayerScoreCard: FC<MultiplayerScoreCardProps> = ({
  player,
  opponent,
  turnControls
}) => {
  const {
    isMyTurn,
    canSubmit,
    previewScores = {},
    selectedCategory = null,
    onCategorySelect,
    onSubmitTurn
  } = turnControls

  const renderRow = (category: ScoreCategory) => {
    const playerScore = player.state.scoreCard[category]
    const opponentScore = opponent.state.scoreCard[category]
    const preview = previewScores[category]
    const isSelected = selectedCategory === category
    const isUsed = player.state.usedCategories.includes(category)
    // for game categories, 0 means no match — treat same as no preview
    const isSchoolCategory = schoolCategories.includes(category)
    const effectivePreview =
      !isSchoolCategory && preview === 0 ? undefined : preview
    const canSelect =
      !isUsed && effectivePreview !== undefined && onCategorySelect

    return (
      <tr
        key={category}
        className={isSelected ? styles.selectedRow : undefined}
        onClick={canSelect ? () => onCategorySelect(category) : undefined}
      >
        <td className={styles.categoryCell}>
          {playerScore !== null ? (
            <span className={styles.filledScore}>{playerScore}</span>
          ) : effectivePreview !== undefined ? (
            <span className={styles.previewScore}>{effectivePreview}</span>
          ) : (
            <span className={styles.emptyScore}>–</span>
          )}
        </td>
        <td
          className={`${styles.categoryName} ${canSelect ? styles.selectableCategory : ''}`}
        >
          {formatCategoryName(category)}
        </td>
        <td className={styles.categoryCell}>
          {opponentScore !== null ? (
            <span className={styles.filledScore}>{opponentScore}</span>
          ) : (
            <span className={styles.emptyScore}>–</span>
          )}
        </td>
      </tr>
    )
  }

  return (
    <table className={styles.scoreTable}>
      <thead>
        <tr>
          <th className={styles.playerHeader}>{player.name}</th>
          <th className={styles.categoryHeader}>
            {isMyTurn && (
              <button
                disabled={!isMyTurn || !canSubmit}
                className={styles.submitButton}
                onClick={onSubmitTurn}
              >
                Submit turn
              </button>
            )}

            {!isMyTurn && (
              <div>
                <LoadingIndicator />
                <p className={styles.waitingMessage}>
                  Waiting for {opponent.name}
                </p>
              </div>
            )}
          </th>
          <th className={styles.playerHeader}>{opponent.name}</th>
        </tr>
      </thead>
      <tbody>
        {schoolCategories.map(renderRow)}
        <tr className={styles.sectionDivider}>
          <td colSpan={3} />
        </tr>
        {gameCategories.map(renderRow)}
      </tbody>
      <tfoot>
        <tr className={styles.totalRow}>
          <td className={styles.totalScore}>{player.state.totalScore}</td>
          <td className={styles.categoryName}>total</td>
          <td className={styles.totalScore}>{opponent.state.totalScore}</td>
        </tr>
      </tfoot>
    </table>
  )
}

export default MultiplayerScoreCard
