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
  deselectDie: (index: number) => void
) => {
  const [diceState, setDiceState] = useState<Dice[]>(diceArray)
  const [boardSections, setBoardSections] = useState<BoardSections>(() =>
    initializeBoard(diceArray)
  )
  const [hasNewRoll, setHasNewRoll] = useState(false)
  const prevRollCountRef = useRef(rollCount)
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  useEffect(() => {
    const selectedDice: Dice[] = selectedIndices.map((idx) => ({
      id: diceArray[idx].id,
      status: DiceStatus.SELECTED,
      value: dice[idx]
    }))

    const rollDice: Dice[] = dice
      .map((value, idx) => ({ value, idx }))
      .filter(({ value, idx }) => !selectedIndices.includes(idx) && value > 0)
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
        return {
          selected: selectedDice,
          roll: [
            ...(prev.roll?.length > 0
              ? (prev.roll
                  .map((d) => rollDice.find((r) => r.id === d.id) || null)
                  .filter(Boolean) as Dice[])
              : rollDice),
            ...rollDice.filter((d) => !prev.roll?.some((p) => p.id === d.id))
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

  // visual-only reorder — multiplayer turn state tracks values, not order
  const handleDiceReorder = useCallback((_orderedIndices: number[]) => {}, [])

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
