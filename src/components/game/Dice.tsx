import { type FC } from 'react'

import Ones from '../../assets/svg/dice-ones.svg'
import Twos from '../../assets/svg/dice-twos.svg'
import Threes from '../../assets/svg/dice-threes.svg'
import Fours from '../../assets/svg/dice-fours.svg'
import Fives from '../../assets/svg/dice-fives.svg'
import Sixes from '../../assets/svg/dice-sixes.svg'
import Empty from '../../assets/svg/dice-empty.svg'
import { ScoreCategory } from '../../features/multiplayer/types'

interface DiceProps {
  kind: number | ScoreCategory
  onClick?: () => void
}

// map both numbers and string categories to their respective SVG components
const DICE_LOOKUP: Record<string | number, FC<{ onClick?: () => void }>> = {
  1: Ones,
  ones: Ones,
  2: Twos,
  twos: Twos,
  3: Threes,
  threes: Threes,
  4: Fours,
  fours: Fours,
  5: Fives,
  fives: Fives,
  6: Sixes,
  sixes: Sixes
}

export const Dice: FC<DiceProps> = ({ kind, onClick }) => {
  // fall back to the Empty component if the key doesn't exist
  const DiceComponent = DICE_LOOKUP[kind] ?? Empty

  return <DiceComponent onClick={onClick} />
}
