import React, { type FC } from 'react'
import { Dice } from './Dice'

const TrainingBoardIcons: FC = () => {

  // show dice svgs in order
  const dice = [1, 2, 3, 4, 5, 6]

  return <>
    {dice.map(item =>
      <Dice key={item} kind={item} />
    )}
  </>
}

export default TrainingBoardIcons
