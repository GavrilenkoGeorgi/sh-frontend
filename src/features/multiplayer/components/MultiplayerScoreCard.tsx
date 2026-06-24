import { FC, JSX } from 'react'
import type { MultiplayerPlayerState, ScoreCategory } from '../types'
import * as styles from './MultiplayerGameBoard.module.sass'
import LoadingIndicator from '../../../components/layout/LoadingIndicator'
import { useTranslation } from 'react-i18next'
import { MAX_SAVES_PER_COMBINATION } from '../../../hooks/useMultiplayerTurn'
import cs from 'classnames'
import { Button } from '../../../components/layout/Button/BaseButton'
import CountUp from 'react-countup'
import { Dice } from '../../../components/game/Dice'

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
  hasRolled?: boolean
  isInSchoolPhase?: boolean
  schoolFailed?: boolean
  previewScores?: Partial<Record<ScoreCategory, number>>
  selectedCategory?: ScoreCategory | null
  onCategorySelect?: (category: ScoreCategory) => void
  onSubmitTurn: () => void
  onFailSchool?: () => void
}

interface MultiplayerScoreCardProps {
  player: ScoreCardParticipant
  opponent: ScoreCardParticipant
  turnControls: TurnControls
}

const formatCategoryName = (category: ScoreCategory): JSX.Element => {
  if (schoolCategories.includes(category)) {
    return <Dice kind={category} />
  }
  return <span>{category.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
}

const MultiplayerScoreCard: FC<MultiplayerScoreCardProps> = ({
  player,
  opponent,
  turnControls
}) => {
  const {
    isMyTurn,
    canSubmit,
    hasRolled = false,
    isInSchoolPhase = false,
    schoolFailed = false,
    previewScores = {},
    selectedCategory = null,
    onCategorySelect,
    onSubmitTurn,
    onFailSchool
  } = turnControls
  const { t } = useTranslation()

  const renderRow = (category: ScoreCategory) => {
    const isSchoolCategory = schoolCategories.includes(category)
    const playerScore = player.state.scoreCard[category]
    const opponentScore = opponent.state.scoreCard[category]
    const preview = previewScores[category]
    const isSelected = selectedCategory === category

    if (isSchoolCategory) {
      const schoolScore = playerScore as number | null
      const opponentSchoolScore = opponentScore as number | null
      const isUsed = schoolScore !== null
      const effectivePreview = preview
      const canSelect =
        !isUsed && effectivePreview !== undefined && onCategorySelect

      return (
        <tr
          key={category}
          className={isSelected ? styles.selectedRow : undefined}
          onClick={canSelect ? () => onCategorySelect(category) : undefined}
        >
          <td className={styles.categoryCell}>
            {schoolScore !== null ? (
              <span className={styles.filledScore}>{schoolScore}</span>
            ) : effectivePreview !== undefined ? (
              <span className={styles.previewScore}>{effectivePreview}</span>
            ) : (
              <span className={styles.emptyScore}>–</span>
            )}
          </td>
          <td
            className={cs(styles.categoryName, {
              [styles.selectableCategory]: canSelect
            })}
          >
            {formatCategoryName(category)}
          </td>
          <td className={styles.categoryCell}>
            {opponentSchoolScore !== null ? (
              <span className={styles.filledScore}>{opponentSchoolScore}</span>
            ) : (
              <span className={styles.emptyScore}>–</span>
            )}
          </td>
        </tr>
      )
    }

    // game category: up to MAX_SAVES_PER_COMBINATION saves per slot
    const savedScores = playerScore as number[]
    const opponentSavedScores = opponentScore as number[]
    const isUsed = savedScores.length >= MAX_SAVES_PER_COMBINATION
    const effectivePreview = preview === 0 ? undefined : preview
    // chance is always score-based; other game categories allow saving zero
    const isChance = category === 'chance'
    const canSelect = isChance
      ? !isUsed && effectivePreview !== undefined && onCategorySelect
      : !isUsed && hasRolled && !isInSchoolPhase && onCategorySelect

    return (
      <tr
        key={category}
        className={isSelected ? styles.selectedRow : undefined}
        onClick={
          canSelect && onCategorySelect
            ? () => onCategorySelect(category)
            : undefined
        }
      >
        <td className={styles.categoryCell}>
          {Array.from({ length: MAX_SAVES_PER_COMBINATION }, (_, i) => {
            if (i < savedScores.length) {
              return (
                <span key={i} className={styles.filledScore}>
                  {savedScores[i]}
                </span>
              )
            }
            if (i === savedScores.length && effectivePreview !== undefined) {
              return (
                <span key={i} className={styles.previewScore}>
                  {effectivePreview}
                </span>
              )
            }
            return (
              <span key={i} className={styles.emptyScore}>
                –
              </span>
            )
          })}
        </td>
        <td
          className={`${styles.categoryName} ${canSelect ? styles.selectableCategory : ''}`}
        >
          {formatCategoryName(category)}
        </td>
        <td className={styles.categoryCell}>
          {Array.from({ length: MAX_SAVES_PER_COMBINATION }, (_, i) => {
            if (i < opponentSavedScores.length) {
              return (
                <span key={i} className={styles.filledScore}>
                  {opponentSavedScores[i]}
                </span>
              )
            }
            return (
              <span key={i} className={styles.emptyScore}>
                –
              </span>
            )
          })}
        </td>
      </tr>
    )
  }

  return (
    <table className={styles.scoreTable}>
      <thead>
        <tr>
          <th
            className={cs(styles.playerHeader, {
              [styles.accent]: isMyTurn
            })}
          >
            {player.name}
          </th>
          <th>
            {isMyTurn && !schoolFailed && (
              <Button
                isDisabled={!canSubmit}
                onClick={onSubmitTurn}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('ui.multiplayer.submitTurn')}
              </Button>
            )}

            {isMyTurn && schoolFailed && (
              <Button onClick={onFailSchool}>
                {t('ui.multiplayer.schoolFailed')}
              </Button>
            )}

            {!isMyTurn && (
              <div>
                <p className={styles.waitingMessage}>
                  <LoadingIndicator />
                </p>
              </div>
            )}
          </th>
          <th
            className={cs(styles.playerHeader, {
              [styles.accent]: !isMyTurn
            })}
          >
            {opponent.name}
          </th>
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
          <td className={styles.totalScore}>
            <CountUp start={0} end={player.state.totalScore} duration={3} />
            {/* {player.state.totalScore} */}
          </td>
          <td className={styles.categoryName}>{t('ui.multiplayer.total')}</td>
          <td className={styles.totalScore}>{opponent.state.totalScore}</td>
        </tr>
      </tfoot>
    </table>
  )
}

export default MultiplayerScoreCard
