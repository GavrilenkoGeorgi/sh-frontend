import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type RootState } from '../store'
import { selectDice, deselectDice } from '../store/slices/shSlice'
import type { Dice, BoardSections } from '../types'
import { DiceStatus } from '../types'
import {
  diceArray,
  initializeBoard
} from '../components/game/controls/DnDHelpers'

// constants for better maintainability
const ANIMATION_DURATION = 2500

export const useDiceBoard = () => {
  const { game } = useSelector((state: RootState) => state.sh)
  const dispatch = useDispatch()

  const [diceState, setDiceState] = useState<Dice[]>(diceArray)
  const [hasNewRoll, setHasNewRoll] = useState<boolean>(false)
  const [boardSections, setBoardSections] = useState<BoardSections>(() =>
    initializeBoard(diceArray)
  )

  const restoreDiceStateFromRedux = useCallback(() => {
    // only restore if there's actual data to restore
    if (!(game.selection.length > 0 || game.roll.some((val) => val > 0))) {
      return
    }

    // create selected dice array preserving existing order
    const currentSelectedDice = boardSections.selected || []
    const restoredSelectedDice = game.selection.map((value, index) => {
      const existingDice = currentSelectedDice[index]
      return {
        id: existingDice?.id || diceArray[index].id,
        status: DiceStatus.SELECTED,
        value: value
      }
    })

    const restoredRollDice = game.roll
      .map((value, index) => {
        if (value > 0) {
          return {
            id: diceArray[game.selection.length + index].id,
            status: DiceStatus.ROLL,
            value: value
          }
        }
        return null
      })
      .filter(Boolean) as Dice[]

    const restoredDiceArray = [...restoredSelectedDice, ...restoredRollDice]

    setBoardSections({
      selected: restoredSelectedDice,
      roll: restoredRollDice
    })
    setDiceState(restoredDiceArray)
  }, [boardSections.selected, game.selection, game.roll])

  const handleDiceSelection = useCallback(
    (diceValue: number) => {
      dispatch(selectDice(diceValue))
    },
    [dispatch]
  )

  const handleDiceDeselection = useCallback(
    (value: number, rollOrder: number[]) => {
      const data = {
        value,
        order: rollOrder
      }
      dispatch(deselectDice(data))
    },
    [dispatch]
  )

  const resetBoard = useCallback(() => {
    const resetDiceArray = diceArray.map((item) => ({
      ...item,
      status: DiceStatus.ROLL,
      value: 0
    }))

    const init = initializeBoard(resetDiceArray)
    setBoardSections(init)
    setDiceState(resetDiceArray)
    setHasNewRoll(false)
  }, [])

  // sync with Redux state changes
  useEffect(() => {
    const rollDice = diceState.filter((item) => item.status === DiceStatus.ROLL)
    const holdDice = diceState.filter(
      (item) => item.status === DiceStatus.SELECTED
    )

    const updatedRollDice = game.roll
      .map((value, index) => {
        // find existing dice to preserve id
        const existingDice = rollDice[index]
        return {
          id: existingDice?.id || diceArray[game.selection.length + index].id,
          status: DiceStatus.ROLL,
          value: value
        }
      })
      .filter((dice) => dice.value > 0)

    const hasRollChanges = updatedRollDice.some(
      (item, index) => !rollDice[index] || item.value !== rollDice[index].value
    )

    const updatedSelectedDice = game.selection.map((value, index) => ({
      id: holdDice[index]?.id || diceArray[index].id,
      status: DiceStatus.SELECTED,
      value: value
    }))

    if (hasRollChanges || holdDice.length !== updatedSelectedDice.length) {
      const newDiceState = [...updatedSelectedDice, ...updatedRollDice]
      setDiceState(newDiceState)
      setHasNewRoll(hasRollChanges && game.roll.some((val) => val > 0))

      setBoardSections((prevBoardSections) => ({
        ...prevBoardSections,
        // update dice values while preserving positions
        selected:
          prevBoardSections.selected?.length > 0
            ? prevBoardSections.selected
                .map(
                  (dice) =>
                    updatedSelectedDice.find(
                      (updatedDice) => updatedDice.id === dice.id
                    ) || dice
                )
                .filter((_, index) => index < game.selection.length)
            : updatedSelectedDice,
        roll: updatedRollDice
      }))

      // reset animation flag after animation completes
      if (hasRollChanges && game.roll.some((val) => val > 0)) {
        setTimeout(() => setHasNewRoll(false), ANIMATION_DURATION)
      }
    }
  }, [game.roll, game.selection, diceState])

  // reset board when game is saved or over
  useEffect(() => {
    if (game.saved || game.over) {
      resetBoard()
    }
  }, [game.saved, game.over, resetBoard])

  // restore dice state on mount if needed
  useEffect(() => {
    restoreDiceStateFromRedux()
  }, []) // only run on mount, not including restoreDiceStateFromRedux to avoid infinite loops

  return {
    diceState,
    setDiceState,
    boardSections,
    setBoardSections,
    hasNewRoll,
    restoreDiceStateFromRedux,
    handleDiceSelection,
    handleDiceDeselection,
    resetBoard
  }
}
