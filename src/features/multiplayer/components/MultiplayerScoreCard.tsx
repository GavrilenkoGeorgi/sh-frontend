import { FC } from 'react'
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel
} from 'react-aria-components'
import type { MultiplayerPlayerState, ScoreCategory } from '../types'
import { GameCombinations } from '../../../types'
import * as styles from './MultiplayerGameBoard.module.sass'
import LoadingIndicator from '../../../components/layout/LoadingIndicator'
import { useTranslation } from 'react-i18next'
import { MAX_SAVES_PER_COMBINATION } from '../../../hooks/useMultiplayerTurn'
import cs from 'classnames'
import { Button } from '../../../components/layout/Button/BaseButton'
import { getCombinationLabel } from '../../../utils/combinationLabels'
import { Pill } from './Pill'
import MultiplayerTrainingScoreCard from './MultiplayerTrainingScoreCard'
import ChevronUpIcon from '../../../assets/svg/icon-chevron-up.svg'

const gameCategories: ScoreCategory[] = Object.values(GameCombinations)

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
    const playerScore = player.state.scoreCard[category]
    const opponentScore = opponent.state.scoreCard[category]
    const preview = previewScores[category]
    const isSelected = selectedCategory === category

    // game category: up to MAX_SAVES_PER_COMBINATION saves per slot
    const savedScores = playerScore as number[]
    const opponentSavedScores = opponentScore as number[]
    const isUsed = savedScores.length >= MAX_SAVES_PER_COMBINATION
    const effectivePreview = preview === 0 ? undefined : preview
    // chance is always score-based; other game categories allow saving zero
    const isChance = category === 'chance'
    const canSaveCategory = isChance
      ? effectivePreview !== undefined
      : hasRolled && !isInSchoolPhase
    const canSelect = !isUsed && canSaveCategory && !!onCategorySelect

    return (
      <div
        key={category}
        role="row"
        className={cs(styles.tableRow, {
          [styles.selectedRow]: isSelected
        })}
        onClick={canSelect ? () => onCategorySelect(category) : undefined}
      >
        <div role="cell" className={styles.categoryCell}>
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
        </div>
        <div
          role="cell"
          className={cs(styles.categoryName, {
            [styles.selectableCategory]: canSelect
          })}
        >
          {getCombinationLabel(category, t)}
        </div>
        <div role="cell" className={styles.categoryCell}>
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
        </div>
      </div>
    )
  }

  return (
    <div className={styles.scoreTable} role="table">
      <MultiplayerTrainingScoreCard
        player={player}
        opponent={opponent}
        isMyTurn={isMyTurn}
        previewScores={previewScores}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />

      <DisclosureGroup className={styles.scoreSections}>
        <Disclosure id="game" className={styles.scoreSection}>
          <h3 className={styles.sectionHeading}>
            <AriaButton slot="trigger" className={styles.sectionToggle}>
              <span className={styles.pillList}>
                {gameCategories.map((category) => (
                  <Pill key={category}>{getCombinationLabel(category, t)}</Pill>
                ))}
              </span>
              {/* rotated via CSS on [data-expanded], keeping one element so the turn animates */}
              <span aria-hidden="true" className={styles.sectionIcon}>
                <ChevronUpIcon />
              </span>
            </AriaButton>
          </h3>
          <DisclosurePanel className={styles.sectionPanel}>
            <div className={styles.panelInner}>
              {gameCategories.map(renderRow)}
            </div>
          </DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>

      <div role="rowgroup" className={styles.submitRow}>
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

        {!isMyTurn && <LoadingIndicator />}
      </div>
    </div>
  )
}

export default MultiplayerScoreCard
