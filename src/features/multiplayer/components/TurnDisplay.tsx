import { useSelector } from 'react-redux'
import * as styles from './TurnDisplay.module.sass'
import {
  selectActiveGame,
  selectOpponent
} from '../../../store/slices/multiplayerSlice'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import clsx from 'clsx'

const TurnDisplay = () => {
  const activeGame = useSelector(selectActiveGame)
  const currentUser = useSelector(selectCurrentUser)
  const opponent = useSelector(selectOpponent)
  const myId = currentUser?._id ?? ''
  const isMyTurn = activeGame?.currentTurnPlayerId === myId

  if (!activeGame || !opponent || !currentUser) {
    return null
  }

  const name = isMyTurn ? 'Your' : `${opponent.username}'s`

  return (
    <p className={clsx(styles.turnNumber, { [styles.userTurn]: isMyTurn })}>
      {name}
      <br /> turn {activeGame.turnNumber}
    </p>
  )
}

export default TurnDisplay
