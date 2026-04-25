import { FC } from 'react'
import { DragOverlay } from '@dnd-kit/core'
import { useMultiplayerDiceBoard } from '../../../hooks/useMultiplayerDiceBoard'
import { useDragHandlers } from '../../../hooks/useDragHandlers'
import BoardSection from '../../../components/game/controls/BoardSection'
import DiceItem from '../../../components/game/controls/DiceItem'
import DnDContextWrapper from '../../../components/game/controls/DnDContextWrapper'
import { dropAnimation } from '../../../components/game/controls/DnDHelpers'
import { PlayButtonIcon } from '../../../components/game/controls/PlayButtonIcon'
import { Portal } from '../../../components/layout/Portal'
import * as styles from '../../../components/game/controls/DnDDiceBoard.module.sass'

interface MultiplayerDnDDiceBoardProps {
  dice: number[]
  selectedIndices: number[]
  rollCount: number
  isLocked: boolean
  selectDie: (index: number) => void
  deselectDie: (index: number) => void
  roll: () => void
}

const MultiplayerDnDDiceBoard: FC<MultiplayerDnDDiceBoardProps> = ({
  dice,
  selectedIndices,
  rollCount,
  isLocked,
  selectDie,
  deselectDie,
  roll
}) => {
  const {
    diceState,
    setDiceState,
    boardSections,
    setBoardSections,
    hasNewRoll,
    handleDiceSelection,
    handleDiceDeselection,
    handleDiceReorder
  } = useMultiplayerDiceBoard(
    dice,
    selectedIndices,
    rollCount,
    selectDie,
    deselectDie
  )

  const { activeDice, handleDragStart, handleDragOver, handleDragEnd } =
    useDragHandlers({
      diceState,
      setDiceState,
      boardSections,
      setBoardSections,
      onDiceSelect: handleDiceSelection,
      onDiceDeselect: handleDiceDeselection,
      onDiceReorder: handleDiceReorder
    })

  return (
    <div className={styles.controls} data-multiplayer>
      <button
        onClick={roll}
        disabled={isLocked}
        className={`${styles.rollButton} ${rollCount === 1 ? styles.rolled : ''} ${rollCount >= 2 ? styles.lastRoll : ''}`}
      >
        <PlayButtonIcon rollCount={rollCount} />
      </button>
      <div className={styles.boardSections}>
        <DnDContextWrapper
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {Object.keys(boardSections).map((boardSectionKey) => (
            <div
              key={boardSectionKey}
              className={styles.board}
              style={{
                color:
                  boardSectionKey === 'selected'
                    ? 'var(--color-accent)'
                    : 'var(--color-primary)'
              }}
            >
              <BoardSection
                id={boardSectionKey}
                title={boardSectionKey}
                dice={boardSections[boardSectionKey]}
                shouldAnimateNewDice={hasNewRoll}
                rollCount={rollCount}
              />
            </div>
          ))}
          <Portal>
            <DragOverlay dropAnimation={dropAnimation}>
              {activeDice != null ? (
                <DiceItem dice={activeDice} isDragging={true} />
              ) : null}
            </DragOverlay>
          </Portal>
        </DnDContextWrapper>
      </div>
    </div>
  )
}

export default MultiplayerDnDDiceBoard
