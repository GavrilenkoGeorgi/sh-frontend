import { useState, type FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { type RootState } from '../../store'
import { setUpdateAvailable } from '../../store/slices/swUpdateSlice'
import { applyServiceWorkerUpdate } from '../../utils/serviceWorker'
import { Button } from './Button/BaseButton'

import CloseIcon from '../../assets/svg/icon-close.svg'
import * as styles from './UpdateToast.module.sass'

const UpdateToast: FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { updateAvailable } = useSelector((state: RootState) => state.swUpdate)
  const [isUpdating, setIsUpdating] = useState(false)

  if (!updateAvailable) return null

  const handleUpdate = (): void => {
    setIsUpdating(true)
    applyServiceWorkerUpdate()
  }

  const handleClose = (): void => {
    dispatch(setUpdateAvailable(false))
  }

  return (
    <div className={styles.updateToast} role="status">
      <span className={styles.message}>{t('ui.headings.newVersion')}</span>
      <Button size="sm" onClick={handleUpdate} isLoading={isUpdating}>
        {t('ui.buttonLabels.update')}
      </Button>
      <Button
        variant="invisible"
        size="tiny"
        onClick={handleClose}
        aria-label={t('ui.buttonLabels.close')}
      >
        <CloseIcon />
      </Button>
    </div>
  )
}

export default UpdateToast
