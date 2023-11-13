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

export const Dice: FC<iDice> = ({ kind }) => {

  switch (kind) {
    case 1:
      return <Ones />
    case 2:
      return <Twos />
    case 3:
      return <Threes />
    case 4:
      return <Fours />
    case 5:
      return <Fives />
    case 6:
      return <Sixes />
    default:
      return <Empty />
  }

}
