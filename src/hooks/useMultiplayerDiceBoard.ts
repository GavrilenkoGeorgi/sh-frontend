import { useState, useEffect, useRef, useCallback } from 'react'
import {
  diceArray,
  initializeBoard
} from '../components/game/controls/DnDHelpers'
import type { Dice, BoardSections } from '../types'
import { DiceStatus } from '../types'

// spring animation (~400ms) plus safety margin
const ANIMATION_DURATION = 800

// adapter hook that converts multiplayer turn state (props-based) into the
// same boardSections/diceState shape that useDragHandlers expects
export const useMultiplayerDiceBoard = (
  dice: number[],
  selectedIndices: number[],
  rollCount: number,
  selectDie: (index: number) => void,
  deselectDie: (index: number) => void,
  reorderSelectedDice: (orderedIndices: number[]) => void
) => {
  const [diceState, setDiceState] = useState<Dice[]>(diceArray)
  const [boardSections, setBoardSections] = useState<BoardSections>(() =>
    initializeBoard(diceArray)
  )
  const [hasNewRoll, setHasNewRoll] = useState(false)
  const prevRollCountRef = useRef(rollCount)
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const selectedDice: Dice[] = selectedIndices.map((idx) => ({
      id: diceArray[idx].id,
      status: DiceStatus.SELECTED,
      value: dice[idx]
    }))

    // before the first roll keep the empty placeholders, same as single player
    const rollDice: Dice[] = dice
      .map((value, idx) => ({ value, idx }))
      .filter(
        ({ value, idx }) =>
          !selectedIndices.includes(idx) && (value > 0 || rollCount === 0)
      )
      .map(({ value, idx }) => ({
        id: diceArray[idx].id,
        status: DiceStatus.ROLL,
        value
      }))

    setDiceState([...selectedDice, ...rollDice])

    const isNewRoll = rollCount > 0 && rollCount > prevRollCountRef.current
    prevRollCountRef.current = rollCount

    setBoardSections((prev) => {
      if (!isNewRoll) {
        // selection changed: update values in-place to preserve visual order
        const keptDice = (prev.roll ?? [])
          .map((d) => rollDice.find((r) => r.id === d.id) || null)
          .filter(Boolean) as Dice[]
        // append only dice that aren't in the roll box yet, so ids stay unique
        return {
          selected: selectedDice,
          roll: [
            ...keptDice,
            ...rollDice.filter((d) => !keptDice.some((k) => k.id === d.id))
          ]
        }
      }
      // new roll: reset to canonical order
      return { selected: selectedDice, roll: rollDice }
    })

    if (isNewRoll) {
      setHasNewRoll(true)
      if (animationTimeoutRef.current != null) {
        clearTimeout(animationTimeoutRef.current)
      }
      animationTimeoutRef.current = setTimeout(() => {
        setHasNewRoll(false)
        animationTimeoutRef.current = null
      }, ANIMATION_DURATION)
    }
  }, [dice, selectedIndices, rollCount])

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current != null) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const handleDiceSelection = useCallback(
    (diceIndex: number) => {
      selectDie(diceIndex)
    },
    [selectDie]
  )

  // second arg is rollOrder from useDragHandlers — not needed for multiplayer
  const handleDiceDeselection = useCallback(
    (diceIndex: number, _rollOrder: number[]) => {
      deselectDie(diceIndex)
    },
    [deselectDie]
  )

  const handleDiceReorder = useCallback(
    (orderedIndices: number[]) => {
      reorderSelectedDice(orderedIndices)
    },
    [reorderSelectedDice]
  )

  return {
    diceState,
    setDiceState,
    boardSections,
    setBoardSections,
    hasNewRoll,
    rollCount,
    handleDiceSelection,
    handleDiceDeselection,
    handleDiceReorder
  }
}
