import { useSelector } from 'react-redux'
import * as styles from './TurnDisplay.module.sass'
import { selectActiveGame } from '../../../store/slices/multiplayerSlice'

const TurnDisplay = () => {
  const activeGame = useSelector(selectActiveGame)

  if (!activeGame) {
    return null
  }

  return <h2>Turn {activeGame.turnNumber}</h2>
}

export default TurnDisplay
