import {
  // Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
  type ModalOverlayProps
} from 'react-aria-components'
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import * as styles from './BaseModal.module.sass'

interface BaseModalProps extends Omit<ModalOverlayProps, 'children'> {
  title: string
  children: ReactNode
  // 'close' function to allow buttons to dismiss the modal manually
  footerActions?: (close: () => void) => ReactNode
}

export function BaseModal({
  title,
  children,
  footerActions,
  isDismissable = true, // Defaults to closing on backdrop click
  isOpen,
  onOpenChange,
  ...props
}: BaseModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className={styles.modalOverlay}
      {...props}
    >
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
        <Modal className={styles.modal}>
          <Dialog className={styles.dialog} aria-label={title}>
            {({ close }) => (
              <>
                {/* Header */}
                <div>
                  <Heading slot="title" className={styles.heading}>
                    {title}
                  </Heading>
                </div>

                {/* Body (Scrollable if content is tall) */}
                <div className={styles.body}>{children}</div>

                {/* Footer */}
                {footerActions && (
                  <div className={styles.footer}>{footerActions(close)}</div>
                )}
              </>
            )}
          </Dialog>
        </Modal>
      </motion.div>
    </ModalOverlay>
  )
}
