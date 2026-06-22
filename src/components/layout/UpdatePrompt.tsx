import { useState, type FC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { type RootState } from '../../store'
import { setUpdateAvailable } from '../../store/slices/swUpdateSlice'
import { applyServiceWorkerUpdate } from '../../utils/serviceWorker'

import * as styles from './UpdatePrompt.module.sass'
import * as sharedStyles from '../../pages/SharedStyles.module.sass'
import { useTranslation } from 'react-i18next'
import { Portal } from './Portal'
import { Button } from './Button/BaseButton'
import HelpCircle from '../../assets/svg/icon-help-circle.svg'
import { Tooltip, TooltipTrigger } from './Tooltip'

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
    <Portal>
      <div className={styles.banner}>
        <span className={styles.message}>
          {t('ui.headings.newVersion')}
          <TooltipTrigger>
            <Button variant="invisible" size="tiny">
              <HelpCircle className={sharedStyles.tooltipIcon} />
            </Button>
            <Tooltip>{t('tooltips.newVersion')}</Tooltip>
          </TooltipTrigger>
        </span>
        <div className={styles.actions}>
          <Button
            size="sm"
            onClick={handleUpdate}
            isLoading={isUpdating}
            isDisabled={isUpdating}
          >
            {t('ui.buttonLabels.update')}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDismiss}>
            {t('ui.buttonLabels.dismiss')}
          </Button>
        </div>
      </div>
    </Portal>
  )
}

export default UpdatePrompt
