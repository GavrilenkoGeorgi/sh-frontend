import { useNavigate } from 'react-router-dom'
import { useGameTour } from '../../hooks/useGameTour'
import { ROUTES } from '../../constants/routes'
import * as styles from '../../pages/Profile.module.sass'

export const RunTourButton = ({ label }: { label: string }) => {
  const navigate = useNavigate()
  const { hasSeenGameTour, resetGameTour } = useGameTour()
  const handleResetTour = (): void => {
    resetGameTour()
    navigate(ROUTES.GAME, { viewTransition: true })
  }

  return (
    <button
      type="button"
      className={styles.linkButton}
      onClick={handleResetTour}
    >
      {label}
    </button>
  )
}
