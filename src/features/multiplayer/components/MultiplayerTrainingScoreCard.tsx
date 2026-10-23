import { FC } from 'react'
import cs from 'classnames'
import type { MultiplayerPlayerState, ScoreCategory } from '../types'
import { SchoolCombinations } from '../../../types'
import * as styles from './MultiplayerGameBoard.module.sass'
import { Dice } from '../../../components/game/Dice'

// keep the narrow type so scoreCard[category] is number | null, no casts needed
const schoolCategories: SchoolCombinations[] = Object.values(SchoolCombinations)

interface ScoreCardParticipant {
  state: MultiplayerPlayerState
  name: string
}

interface MultiplayerTrainingScoreCardProps {
  player: ScoreCardParticipant
  opponent: ScoreCardParticipant
  isMyTurn: boolean
  previewScores?: Partial<Record<ScoreCategory, number>>
  selectedCategory?: ScoreCategory | null
  onCategorySelect?: (category: ScoreCategory) => void
}

interface ParticipantScoreRowProps {
  participant: ScoreCardParticipant
  isAccent: boolean
}

// name on one side, total score on the other
const ParticipantScoreRow: FC<ParticipantScoreRowProps> = ({
  participant,
  isAccent
}) => (
  <div className={styles.trainingHeaderRow}>
    <span className={cs(styles.playerHeader, { [styles.accent]: isAccent })}>
      {participant.name}
    </span>
    <span className={cs(styles.totalScore, { [styles.accent]: isAccent })}>
      {participant.state.totalScore}
    </span>
  </div>
)

interface TrainingDiceProps {
  player: ScoreCardParticipant
  opponent: ScoreCardParticipant
  previewScores: Partial<Record<ScoreCategory, number>>
  selectedCategory: ScoreCategory | null
  onCategorySelect?: (category: ScoreCategory) => void
}

interface ScoreValueProps {
  score: number | null
  preview?: number
}

// saved score, otherwise the preview for the currently selected dice, otherwise a dash
const ScoreValue: FC<ScoreValueProps> = ({ score, preview }) => {
  if (score !== null) return <span className={styles.filledScore}>{score}</span>
  if (preview !== undefined) {
    return <span className={styles.previewScore}>{preview}</span>
  }
  return <span className={styles.emptyScore}>–</span>
}

// score cells for one participant, aligned with the dice column below/above them
const renderScoreCells = (
  participant: ScoreCardParticipant,
  previewScores: Partial<Record<ScoreCategory, number>> = {}
) =>
  schoolCategories.map((category) => (
    <div key={category} className={styles.trainingScoreCell}>
      <ScoreValue
        score={participant.state.scoreCard[category]}
        preview={previewScores[category]}
      />
    </div>
  ))

// player's scores above the dice, opponent's scores below — dice stay clickable to save a school category
const TrainingDice: FC<TrainingDiceProps> = ({
  player,
  opponent,
  previewScores,
  selectedCategory,
  onCategorySelect
}) => (
  <div className={styles.gameDash}>
    {renderScoreCells(player, previewScores)}
    {schoolCategories.map((category) => {
      const score = player.state.scoreCard[category]
      const preview = previewScores[category]
      const isUsed = score !== null
      const canSelect = !isUsed && preview !== undefined && !!onCategorySelect
      const isSelected = selectedCategory === category

      return (
        <div
          key={category}
          role="cell"
          className={cs(styles.categoryCell, {
            [styles.selectableCategory]: canSelect,
            [styles.selectedRow]: isSelected
          })}
          onClick={canSelect ? () => onCategorySelect(category) : undefined}
        >
          <Dice kind={category} />
        </div>
      )
    })}
    {renderScoreCells(opponent)}
  </div>
)

const MultiplayerTrainingScoreCard: FC<MultiplayerTrainingScoreCardProps> = ({
  player,
  opponent,
  isMyTurn,
  previewScores = {},
  selectedCategory = null,
  onCategorySelect
}) => (
  <section>
    <ParticipantScoreRow participant={player} isAccent={isMyTurn} />
    <TrainingDice
      player={player}
      opponent={opponent}
      previewScores={previewScores}
      selectedCategory={selectedCategory}
      onCategorySelect={onCategorySelect}
    />
    <ParticipantScoreRow participant={opponent} isAccent={!isMyTurn} />
  </section>
)

export default MultiplayerTrainingScoreCard
