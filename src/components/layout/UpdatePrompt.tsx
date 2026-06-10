import { useState, type FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from '../../store'
import { setUpdateAvailable } from '../../store/slices/swUpdateSlice'
import { applyServiceWorkerUpdate } from '../../utils/serviceWorker'

import * as styles from './UpdatePrompt.module.sass'
import LoadingIndicator from './LoadingIndicator'
import { useTranslation } from 'react-i18next'

const UpdatePrompt: FC = () => {
  const dispatch = useDispatch()
  const { updateAvailable } = useSelector((state: RootState) => state.swUpdate)
  const [isUpdating, setIsUpdating] = useState(false)
  const { t } = useTranslation()

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
      <span className={styles.message}>{t('ui.headings.newVersion')}</span>
      <button
        type="button"
        className={styles.updateBtn}
        onClick={handleUpdate}
        disabled={isUpdating}
      >
        {isUpdating ? <LoadingIndicator dark /> : t('ui.buttonLabels.update')}
      </button>
      <button
        type="button"
        className={styles.dismissBtn}
        onClick={handleDismiss}
      >
        {t('ui.buttonLabels.dismiss')}
      </button>
    </div>
  )
}

export default UpdatePrompt
