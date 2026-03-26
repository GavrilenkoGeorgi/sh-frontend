import { useState, type FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from '../../store'
import { setUpdateAvailable } from '../../store/slices/swUpdateSlice'
import { applyServiceWorkerUpdate } from '../../utils/serviceWorker'

import * as styles from './UpdatePrompt.module.sass'
import LoadingIndicator from './LoadingIndicator'

const UpdatePrompt: FC = () => {
  const dispatch = useDispatch()
  const { updateAvailable } = useSelector((state: RootState) => state.swUpdate)
  const [isUpdating, setIsUpdating] = useState(false)

  if (!updateAvailable) return null

  const handleUpdate = () => {
    setIsUpdating(true)
    applyServiceWorkerUpdate()
  }

  const handleDismiss = () => {
    dispatch(setUpdateAvailable(false))
  }

  return (
    <div className={styles.banner}>
      <span className={styles.message}>A new version is available.</span>
      <button
        type="button"
        className={styles.updateBtn}
        onClick={handleUpdate}
        disabled={isUpdating}
      >
        {isUpdating ? <LoadingIndicator dark /> : 'Update'}
      </button>
      <button
        type="button"
        className={styles.dismissBtn}
        onClick={handleDismiss}
      >
        Dismiss
      </button>
    </div>
  )
}

export default UpdatePrompt
