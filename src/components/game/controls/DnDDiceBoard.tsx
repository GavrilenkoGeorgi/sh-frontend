import React, { type FC } from 'react'
import { DragOverlay } from '@dnd-kit/core'

import { dropAnimation } from './DnDHelpers'
import BoardSection from './BoardSection'
import DiceItem from './DiceItem'
import MainButton from './MainButton'
import DnDContextWrapper from './DnDContextWrapper'
import * as styles from './DnDDiceBoard.module.sass'
import { usePWALifecycle } from '../../../hooks/usePWALifecycle'
import { useDiceBoard, useDragHandlers } from '../../../hooks'
import { Portal } from '../../layout/Portal'

const DnDDiceBoard: FC = () => {
  const {
    diceState,
    setDiceState,
    boardSections,
    setBoardSections,
    hasNewRoll,
    restoreDiceStateFromRedux,
    handleDiceSelection,
    handleDiceDeselection
  } = useDiceBoard()

  const { activeDice, handleDragStart, handleDragOver, handleDragEnd } =
    useDragHandlers({
      diceState,
      setDiceState,
      boardSections,
      setBoardSections,
      onDiceSelect: handleDiceSelection,
      onDiceDeselect: handleDiceDeselection
    })

  // PWA lifecycle for mobile devices
  usePWALifecycle({
    onAppVisible: () => {
      // when app becomes visible again restore state
      // we check this inside the useDiceBoard hook as well
      restoreDiceStateFromRedux()
    }
  })

  return (
    <div className={styles.controls}>
      <div className={styles.boardSections}>
        <DnDContextWrapper
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {Object.keys(boardSections).map((boardSectionKey) => (
            <div key={boardSectionKey} className={styles.board}>
              <BoardSection
                id={boardSectionKey}
                title={boardSectionKey}
                dice={boardSections[boardSectionKey]}
                shouldAnimateNewDice={hasNewRoll}
              />
            </div>
          ))}
          {/* draggable item animation */}
          <Portal>
            <DragOverlay dropAnimation={dropAnimation}>
              {activeDice != null ? (
                <DiceItem
                  dice={activeDice}
                  isDragging={true}
                  shouldAnimate={false}
                />
              ) : null}
            </DragOverlay>
          </Portal>
        </DnDContextWrapper>
      </div>
      <MainButton />
    </div>
  )
}

export default DnDDiceBoard
