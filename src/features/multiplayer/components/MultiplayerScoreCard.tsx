import { FC } from 'react'
import type { MultiplayerPlayerState, ScoreCategory } from '../types'
import * as styles from './MultiplayerGameBoard.module.sass'

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

interface MultiplayerScoreCardProps {
  playerState: MultiplayerPlayerState
  opponentState: MultiplayerPlayerState
  playerName: string
  opponentName: string
  previewScores?: Partial<Record<ScoreCategory, number>>
  selectedCategory?: ScoreCategory | null
  onCategorySelect?: (category: ScoreCategory) => void
}

const formatCategoryName = (category: ScoreCategory): string => {
  return category.replace(/([A-Z])/g, ' $1').toLowerCase()
}

const MultiplayerScoreCard: FC<MultiplayerScoreCardProps> = ({
  playerState,
  opponentState,
  playerName,
  opponentName,
  previewScores = {},
  selectedCategory = null,
  onCategorySelect
}) => {
  const renderRow = (category: ScoreCategory) => {
    const playerScore = playerState.scoreCard[category]
    const opponentScore = opponentState.scoreCard[category]
    const preview = previewScores[category]
    const isSelected = selectedCategory === category
    const isUsed = playerState.usedCategories.includes(category)
    const canSelect = !isUsed && preview !== undefined && onCategorySelect

    return (
      <tr
        key={category}
        className={isSelected ? styles.selectedRow : undefined}
        onClick={canSelect ? () => onCategorySelect(category) : undefined}
      >
        <td className={styles.categoryCell}>
          {playerScore !== null ? (
            <span className={styles.filledScore}>{playerScore}</span>
          ) : preview !== undefined ? (
            <span className={styles.previewScore}>{preview}</span>
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
          <th className={styles.playerHeader}>{playerName}</th>
          <th className={styles.categoryHeader}></th>
          <th className={styles.playerHeader}>{opponentName}</th>
        </tr>
      </thead>
      <tbody>
        {schoolCategories.map(renderRow)}
        <tr className={styles.sectionDivider}>
          <td colSpan={3}></td>
        </tr>
        {gameCategories.map(renderRow)}
      </tbody>
      <tfoot>
        <tr className={styles.totalRow}>
          <td className={styles.totalScore}>{playerState.totalScore}</td>
          <td className={styles.categoryName}>total</td>
          <td className={styles.totalScore}>{opponentState.totalScore}</td>
        </tr>
      </tfoot>
    </table>
  )
}

export default MultiplayerScoreCard
