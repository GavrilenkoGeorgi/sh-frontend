import { useNavigate } from 'react-router'
import { useGameTour } from '../../hooks/useGameTour'
import { ROUTES } from '../../constants/routes'
import * as styles from '../../pages/Profile.module.sass'
import { toPath } from '../../utils'

export const RunTourButton = ({ label }: { label: string }) => {
  const navigate = useNavigate()
  const { resetGameTour } = useGameTour()
  const handleResetTour = (): void => {
    resetGameTour()
    navigate(toPath(ROUTES.PLAY), { viewTransition: true })
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
