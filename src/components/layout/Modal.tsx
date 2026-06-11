import { type FC } from 'react'
import { motion } from 'framer-motion'
import type { Nullable } from '../../types'

import LoadingIndicator from './LoadingIndicator'
import * as styles from './Modal.module.sass'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-aria-components'

interface ModalProps {
  heading: string
  text: string
  btnLabel: string
  onClick: () => void
  score?: number
  userName?: Nullable<string>
  isBusy?: boolean
  close?: () => void
}

const Modal: FC<ModalProps> = ({
  heading,
  text,
  btnLabel,
  isBusy = false,
  onClick,
  score,
  close = null
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.modal}>
      <div className={styles.blur}></div>
      <motion.div
        key="modal"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 4,
          ease: [0.6, -0.05, 0.01, 0.99],
          type: 'spring',
          stiffness: 100
        }}
      >
        <div className={styles.message}>
          <h2>{heading}</h2>
          <p>
            {text} {score}
          </p>
          <div className={styles.buttons}>
            <Button
              onClick={onClick}
              isDisabled={isBusy}
              type="button"
              className={styles.button}
            >
              {isBusy ? <LoadingIndicator /> : `${btnLabel}`}
            </Button>
            {close !== null && (
              <Button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  close()
                }}
              >
                {t('ui.buttonLabels.cancel')}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Modal
