import { FC, JSX } from 'react'
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel
} from 'react-aria-components'
import type { MultiplayerPlayerState, ScoreCategory } from '../types'
import { SchoolCombinations, GameCombinations } from '../../../types'
import * as styles from './MultiplayerGameBoard.module.sass'
import LoadingIndicator from '../../../components/layout/LoadingIndicator'
import { useTranslation } from 'react-i18next'
import { type TFunction } from 'i18next'
import { MAX_SAVES_PER_COMBINATION } from '../../../hooks/useMultiplayerTurn'
import cs from 'classnames'
import { Button } from '../../../components/layout/Button/BaseButton'
import { Dice } from '../../../components/game/Dice'
import { getCombinationLabel } from '../../../utils/combinationLabels'
import { Pill } from './Pill'
import ChevronUpIcon from '../../../assets/svg/icon-chevron-up.svg'
import ChevronDownIcon from '../../../assets/svg/icon-chevron-down.svg'

const schoolCategories: ScoreCategory[] = Object.values(SchoolCombinations)
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

const formatCategoryName = (
  category: ScoreCategory,
  t: TFunction
): JSX.Element => {
  if (schoolCategories.includes(category)) {
    return <Dice kind={category} />
  }
  return <span>{getCombinationLabel(category, t)}</span>
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
        <div
          key={category}
          role="row"
          className={cs(styles.tableRow, {
            [styles.selectedRow]: isSelected
          })}
          onClick={canSelect ? () => onCategorySelect(category) : undefined}
        >
          <div role="cell" className={styles.categoryCell}>
            {schoolScore !== null ? (
              <span className={styles.filledScore}>{schoolScore}</span>
            ) : effectivePreview !== undefined ? (
              <span className={styles.previewScore}>{effectivePreview}</span>
            ) : (
              <span className={styles.emptyScore}>–</span>
            )}
          </div>
          <div
            role="cell"
            className={cs(styles.categoryName, {
              [styles.selectableCategory]: canSelect
            })}
          >
            {formatCategoryName(category, t)}
          </div>
          <div role="cell" className={styles.categoryCell}>
            {opponentSchoolScore !== null ? (
              <span className={styles.filledScore}>{opponentSchoolScore}</span>
            ) : (
              <span className={styles.emptyScore}>–</span>
            )}
          </div>
        </div>
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
      <div
        key={category}
        role="row"
        className={cs(styles.tableRow, {
          [styles.selectedRow]: isSelected
        })}
        onClick={
          canSelect && onCategorySelect
            ? () => onCategorySelect(category)
            : undefined
        }
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
          className={`${styles.categoryName} ${canSelect ? styles.selectableCategory : ''}`}
        >
          {formatCategoryName(category, t)}
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
      <div role="rowgroup">
        <div role="row" className={styles.tableRow}>
          <div
            role="columnheader"
            className={cs(styles.playerHeader, {
              [styles.accent]: isMyTurn
            })}
          >
            {player.name}
          </div>
          <div role="columnheader" className={styles.tableHeaderCell}>
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
          <div
            role="columnheader"
            className={cs(styles.playerHeader, {
              [styles.accent]: !isMyTurn
            })}
          >
            {opponent.name}
          </div>
        </div>
      </div>

      <DisclosureGroup
        allowsMultipleExpanded
        defaultExpandedKeys={['training']}
        className={styles.scoreSections}
      >
        <Disclosure id="training" className={styles.scoreSection}>
          {({ isExpanded }) => (
            <>
              <h3 className={styles.sectionHeading}>
                <AriaButton slot="trigger" className={styles.sectionToggle}>
                  {!isExpanded && (
                    <>
                      <Dice kind={'ones'} />
                      <Dice kind={'twos'} />
                      <Dice kind={'threes'} />
                      <Dice kind={'fours'} />
                      <Dice kind={'fives'} />
                      <Dice kind={'sixes'} />
                    </>
                  )}
                  <span aria-hidden="true" className={styles.sectionIcon}>
                    {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
                  </span>
                </AriaButton>
              </h3>
              <DisclosurePanel className={styles.sectionPanel}>
                <div className={styles.panelInner}>
                  {schoolCategories.map(renderRow)}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        <Disclosure id="game" className={styles.scoreSection}>
          {({ isExpanded }) => (
            <>
              <h3 className={styles.sectionHeading}>
                <AriaButton slot="trigger" className={styles.sectionToggle}>
                  {!isExpanded && (
                    <span className={styles.pillList}>
                      {gameCategories.map((category) => (
                        <Pill key={category}>
                          {getCombinationLabel(category, t)}
                        </Pill>
                      ))}
                    </span>
                  )}
                  <span aria-hidden="true" className={styles.sectionIcon}>
                    {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
                  </span>
                </AriaButton>
              </h3>
              <DisclosurePanel className={styles.sectionPanel}>
                <div className={styles.panelInner}>
                  {gameCategories.map(renderRow)}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </DisclosureGroup>

      <div role="rowgroup">
        <div role="row" className={cs(styles.tableRow, styles.totalRow)}>
          <div role="cell" className={styles.totalScore}>
            {player.state.totalScore}
          </div>
          <div role="cell" className={styles.categoryName}>
            {t('ui.multiplayer.total')}
          </div>
          <div role="cell" className={styles.totalScore}>
            {opponent.state.totalScore}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiplayerScoreCard
