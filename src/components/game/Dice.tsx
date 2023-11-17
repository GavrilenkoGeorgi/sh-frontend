import React, { type FC } from 'react'

import Ones from '../../assets/svg/dice-ones.svg'
import Twos from '../../assets/svg/dice-twos.svg'
import Threes from '../../assets/svg/dice-threes.svg'
import Fours from '../../assets/svg/dice-fours.svg'
import Fives from '../../assets/svg/dice-fives.svg'
import Sixes from '../../assets/svg/dice-sixes.svg'
import Empty from '../../assets/svg/dice-empty.svg'

interface iDice {
  kind: number
  onClick?: () => void
}

export const Dice: FC<iDice> = ({ kind, onClick }) => {

  const handleClick = (): void => {
    if (onClick != null) onClick()
  }

  switch (kind) {
    case 1: // we are returning svg image with a click handler
      return <Ones onClick={handleClick} />
    case 2:
      return <Twos onClick={handleClick} />
    case 3:
      return <Threes onClick={handleClick} />
    case 4:
      return <Fours onClick={handleClick} />
    case 5:
      return <Fives onClick={handleClick} />
    case 6:
      return <Sixes onClick={handleClick} />
    default:
      return <Empty onClick={handleClick} />
  }

}
